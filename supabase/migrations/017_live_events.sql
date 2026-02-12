-- 017_live_events.sql
-- Live voting events: time-limited FOMO events with real-time counters

-- 1. Live events table
CREATE TABLE IF NOT EXISTS live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  coin_reward INT DEFAULT 20,
  mystery_box_guaranteed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_live_events" ON live_events
  FOR SELECT USING (true);

-- 2. Live event votes
CREATE TABLE IF NOT EXISTS live_event_votes (
  event_id UUID NOT NULL REFERENCES live_events(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  choice TEXT NOT NULL CHECK (choice IN ('a', 'b')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE live_event_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_live_event_votes" ON live_event_votes
  FOR SELECT USING (true);
CREATE POLICY "users_insert_live_event_votes" ON live_event_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for live counters
ALTER PUBLICATION supabase_realtime ADD TABLE live_event_votes;

-- 3. Get current/upcoming live event with vote counts
CREATE OR REPLACE FUNCTION get_live_event()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_event live_events%ROWTYPE;
  v_count_a INT;
  v_count_b INT;
  v_user_choice TEXT;
BEGIN
  v_user_id := auth.uid();

  -- Find active event (started but not ended)
  SELECT * INTO v_event
  FROM live_events
  WHERE starts_at <= now() AND ends_at > now()
  ORDER BY starts_at DESC
  LIMIT 1;

  -- If no active, find next upcoming (within 24 hours)
  IF v_event IS NULL THEN
    SELECT * INTO v_event
    FROM live_events
    WHERE starts_at > now() AND starts_at <= now() + interval '24 hours'
    ORDER BY starts_at ASC
    LIMIT 1;

    IF v_event IS NULL THEN
      RETURN json_build_object('has_event', false);
    END IF;

    -- Upcoming event - return without counts
    RETURN json_build_object(
      'has_event', true,
      'status', 'upcoming',
      'id', v_event.id,
      'option_a', v_event.option_a,
      'option_b', v_event.option_b,
      'starts_at', v_event.starts_at,
      'ends_at', v_event.ends_at,
      'coin_reward', v_event.coin_reward,
      'mystery_box_guaranteed', v_event.mystery_box_guaranteed
    );
  END IF;

  -- Active event - get counts
  SELECT
    COUNT(*) FILTER (WHERE choice = 'a'),
    COUNT(*) FILTER (WHERE choice = 'b')
  INTO v_count_a, v_count_b
  FROM live_event_votes
  WHERE event_id = v_event.id;

  -- Check if user already voted
  SELECT choice INTO v_user_choice
  FROM live_event_votes
  WHERE event_id = v_event.id AND user_id = v_user_id;

  RETURN json_build_object(
    'has_event', true,
    'status', 'active',
    'id', v_event.id,
    'option_a', v_event.option_a,
    'option_b', v_event.option_b,
    'starts_at', v_event.starts_at,
    'ends_at', v_event.ends_at,
    'coin_reward', v_event.coin_reward,
    'mystery_box_guaranteed', v_event.mystery_box_guaranteed,
    'count_a', v_count_a,
    'count_b', v_count_b,
    'user_choice', v_user_choice
  );
END;
$$;

-- 4. Submit live event vote
CREATE OR REPLACE FUNCTION submit_live_event_vote(
  p_event_id UUID,
  p_choice TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_event live_events%ROWTYPE;
  v_count_a INT;
  v_count_b INT;
BEGIN
  v_user_id := auth.uid();

  -- Verify event is active
  SELECT * INTO v_event
  FROM live_events
  WHERE id = p_event_id AND starts_at <= now() AND ends_at > now();

  IF v_event IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'event_not_active');
  END IF;

  -- Check if already voted
  IF EXISTS(SELECT 1 FROM live_event_votes WHERE event_id = p_event_id AND user_id = v_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'already_voted');
  END IF;

  -- Submit vote
  INSERT INTO live_event_votes (event_id, user_id, choice)
  VALUES (p_event_id, v_user_id, p_choice);

  -- Award coins
  UPDATE user_profiles
  SET coins = COALESCE(coins, 0) + v_event.coin_reward
  WHERE user_id = v_user_id;

  -- Get updated counts
  SELECT
    COUNT(*) FILTER (WHERE choice = 'a'),
    COUNT(*) FILTER (WHERE choice = 'b')
  INTO v_count_a, v_count_b
  FROM live_event_votes
  WHERE event_id = p_event_id;

  RETURN json_build_object(
    'success', true,
    'count_a', v_count_a,
    'count_b', v_count_b,
    'coins_earned', v_event.coin_reward
  );
END;
$$;
