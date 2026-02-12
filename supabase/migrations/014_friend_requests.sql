-- 014_friend_requests.sql
-- Friend request system: pending/accept/reject flow instead of auto-add

-- 1. Friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  UNIQUE(from_user_id, to_user_id),
  CHECK(from_user_id != to_user_id)
);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_requests" ON friend_requests FOR ALL
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE INDEX idx_friend_requests_to ON friend_requests(to_user_id, status);
CREATE INDEX idx_friend_requests_from ON friend_requests(from_user_id, status);

-- 2. Send friend request (replaces direct add)
CREATE OR REPLACE FUNCTION send_friend_request(
  p_code TEXT,
  p_is_premium BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_friend_id UUID;
  v_friend_count INT;
  v_free_limit INT := 3;
BEGIN
  v_user_id := auth.uid();

  -- Find target user by code
  SELECT user_id INTO v_friend_id
  FROM user_profiles WHERE friend_code = UPPER(p_code);

  IF v_friend_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  -- Can't add self
  IF v_friend_id = v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'self');
  END IF;

  -- Check if already friends (in either direction)
  IF EXISTS(
    SELECT 1 FROM friendships
    WHERE (user_id = v_user_id AND friend_id = v_friend_id)
       OR (user_id = v_friend_id AND friend_id = v_user_id)
  ) THEN
    RETURN json_build_object('success', false, 'error', 'already_friends');
  END IF;

  -- Check if request already pending (in either direction)
  IF EXISTS(
    SELECT 1 FROM friend_requests
    WHERE status = 'pending'
      AND ((from_user_id = v_user_id AND to_user_id = v_friend_id)
        OR (from_user_id = v_friend_id AND to_user_id = v_user_id))
  ) THEN
    RETURN json_build_object('success', false, 'error', 'already_pending');
  END IF;

  -- Check friend limit for free users (count existing friends)
  IF NOT p_is_premium THEN
    SELECT COUNT(*) INTO v_friend_count
    FROM friendships
    WHERE user_id = v_user_id OR friend_id = v_user_id;

    IF v_friend_count >= v_free_limit THEN
      RETURN json_build_object('success', false, 'error', 'limit_reached');
    END IF;
  END IF;

  -- Create pending request (upsert in case of previously rejected)
  INSERT INTO friend_requests (from_user_id, to_user_id, status, created_at, responded_at)
  VALUES (v_user_id, v_friend_id, 'pending', now(), NULL)
  ON CONFLICT (from_user_id, to_user_id)
  DO UPDATE SET status = 'pending', created_at = now(), responded_at = NULL;

  RETURN json_build_object('success', true);
END;
$$;

-- 3. Respond to a friend request (accept/reject)
CREATE OR REPLACE FUNCTION respond_friend_request(
  p_request_id UUID,
  p_accept BOOLEAN
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_request friend_requests%ROWTYPE;
BEGIN
  v_user_id := auth.uid();

  -- Get the request (must be addressed to current user)
  SELECT * INTO v_request
  FROM friend_requests
  WHERE id = p_request_id AND to_user_id = v_user_id AND status = 'pending';

  IF v_request IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  IF p_accept THEN
    -- Accept: update request and create bidirectional friendship
    UPDATE friend_requests
    SET status = 'accepted', responded_at = now()
    WHERE id = p_request_id;

    -- Create bidirectional friendship (ignore if somehow already exists)
    INSERT INTO friendships (user_id, friend_id)
    VALUES (v_request.from_user_id, v_request.to_user_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO friendships (user_id, friend_id)
    VALUES (v_request.to_user_id, v_request.from_user_id)
    ON CONFLICT DO NOTHING;
  ELSE
    -- Reject
    UPDATE friend_requests
    SET status = 'rejected', responded_at = now()
    WHERE id = p_request_id;
  END IF;

  RETURN json_build_object('success', true);
END;
$$;

-- 4. Get pending friend requests (incoming)
CREATE OR REPLACE FUNCTION get_pending_friend_requests()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(req) INTO v_result
  FROM (
    SELECT
      fr.id,
      fr.from_user_id,
      p.friend_code AS from_friend_code,
      p.display_name AS from_display_name,
      fr.created_at
    FROM friend_requests fr
    JOIN user_profiles p ON p.user_id = fr.from_user_id
    WHERE fr.to_user_id = auth.uid() AND fr.status = 'pending'
    ORDER BY fr.created_at DESC
  ) req;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 5. Update add_friend_by_code to redirect to send_friend_request
-- (backwards compatibility alias)
CREATE OR REPLACE FUNCTION add_friend_by_code(
  p_code TEXT,
  p_is_premium BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN send_friend_request(p_code, p_is_premium);
END;
$$;
