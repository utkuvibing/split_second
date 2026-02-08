-- 011_friends.sql
-- Friend code system: 6-digit codes, bidirectional friendships, compatibility scores

-- 1. Add friend_code to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS friend_code TEXT UNIQUE;

-- 2. Helper to generate unique friend code
-- Uses ABCDEFGHJKMNPQRSTUVWXYZ23456789 (no O/0/I/1/L to avoid confusion)
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := '';
    FOR i IN 1..6 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;

    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE friend_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;

  RETURN v_code;
END;
$$;

-- 3. Friendships table (bidirectional: both user_id and friend_id can look up)
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  friend_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK(user_id != friend_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_friendships" ON friendships FOR ALL
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);

-- 4. Update get_or_create_profile to auto-assign friend_code
CREATE OR REPLACE FUNCTION get_or_create_profile()
RETURNS JSONB AS $$
DECLARE v_profile JSONB;
BEGIN
  INSERT INTO user_profiles (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO user_equipped (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  -- Auto-assign friend code if missing
  UPDATE user_profiles
  SET friend_code = generate_friend_code()
  WHERE user_id = auth.uid() AND friend_code IS NULL;

  SELECT jsonb_build_object(
    'is_premium', p.is_premium,
    'premium_until', p.premium_until,
    'coins', COALESCE(p.coins, 0),
    'friend_code', p.friend_code,
    'theme_id', e.theme_id,
    'frame_id', e.frame_id,
    'vote_effect_id', e.vote_effect_id
  ) INTO v_profile
  FROM user_profiles p
  JOIN user_equipped e ON e.user_id = p.user_id
  WHERE p.user_id = auth.uid();

  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add friend by code
CREATE OR REPLACE FUNCTION add_friend_by_code(
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

  -- Find friend by code
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

  -- Check friend limit for free users
  IF NOT p_is_premium THEN
    SELECT COUNT(*) INTO v_friend_count
    FROM friendships
    WHERE user_id = v_user_id OR friend_id = v_user_id;

    IF v_friend_count >= v_free_limit THEN
      RETURN json_build_object('success', false, 'error', 'limit_reached');
    END IF;
  END IF;

  -- Create bidirectional friendship
  INSERT INTO friendships (user_id, friend_id) VALUES (v_user_id, v_friend_id);
  INSERT INTO friendships (user_id, friend_id) VALUES (v_friend_id, v_user_id);

  RETURN json_build_object('success', true, 'friend_id', v_friend_id);
END;
$$;

-- 6. Get friends list with compatibility score
CREATE OR REPLACE FUNCTION get_friends_list()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(friend_row) INTO v_result
  FROM (
    SELECT
      f.friend_id,
      p.friend_code,
      f.created_at,
      -- Compatibility: matching votes / common questions
      (
        SELECT CASE WHEN COUNT(*) >= 3 THEN
          ROUND(
            COUNT(*) FILTER (WHERE v1.choice = v2.choice)::NUMERIC
            / COUNT(*)::NUMERIC * 100
          )
        ELSE NULL END
        FROM votes v1
        JOIN votes v2 ON v2.question_id = v1.question_id AND v2.user_id = f.friend_id
        WHERE v1.user_id = v_user_id
      ) AS compatibility
    FROM friendships f
    JOIN user_profiles p ON p.user_id = f.friend_id
    WHERE f.user_id = v_user_id
    ORDER BY f.created_at DESC
  ) friend_row;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 7. Get friend votes for a specific question
CREATE OR REPLACE FUNCTION get_friend_votes_for_question(p_question_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(fv) INTO v_result
  FROM (
    SELECT
      f.friend_id,
      p.friend_code,
      v.choice,
      v.created_at AS voted_at
    FROM friendships f
    JOIN user_profiles p ON p.user_id = f.friend_id
    LEFT JOIN votes v ON v.user_id = f.friend_id AND v.question_id = p_question_id
    WHERE f.user_id = v_user_id
    ORDER BY v.created_at DESC NULLS LAST
  ) fv;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 8. Remove friend (removes both directions)
CREATE OR REPLACE FUNCTION remove_friend(p_friend_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  DELETE FROM friendships
  WHERE (user_id = v_user_id AND friend_id = p_friend_id)
     OR (user_id = p_friend_id AND friend_id = v_user_id);

  RETURN json_build_object('success', true);
END;
$$;
