-- Badge unlock tracking
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges (user_id);

-- RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RPC: get user badges
CREATE OR REPLACE FUNCTION get_user_badges()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_result JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'badge_id', badge_id,
    'unlocked_at', unlocked_at
  )), '[]'::jsonb)
  INTO v_result
  FROM user_badges
  WHERE user_id = v_user_id;

  RETURN v_result;
END;
$$;

-- RPC: unlock a badge (returns true if newly unlocked, false if already existed)
CREATE OR REPLACE FUNCTION unlock_badge(p_badge_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  INSERT INTO user_badges (user_id, badge_id)
  VALUES (v_user_id, p_badge_id)
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  -- FOUND is true when INSERT actually inserted a row
  RETURN FOUND;
END;
$$;

-- RPC: get badge context (vote counts, majority counts, category counts, etc.)
CREATE OR REPLACE FUNCTION get_badge_context()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_total_votes INT;
  v_majority_count INT;
  v_rebel_count INT;
  v_categories JSONB;
  v_streak RECORD;
BEGIN
  -- Total votes
  SELECT COUNT(*) INTO v_total_votes
  FROM votes WHERE user_id = v_user_id;

  -- Majority count (user voted with majority)
  SELECT COUNT(*) INTO v_majority_count
  FROM votes v
  JOIN question_results qr ON qr.question_id = v.question_id
  WHERE v.user_id = v_user_id
    AND (
      (v.choice = 'a' AND qr.count_a > qr.count_b)
      OR (v.choice = 'b' AND qr.count_b > qr.count_a)
    );

  -- Rebel count (user voted against majority)
  SELECT COUNT(*) INTO v_rebel_count
  FROM votes v
  JOIN question_results qr ON qr.question_id = v.question_id
  WHERE v.user_id = v_user_id
    AND (
      (v.choice = 'a' AND qr.count_a < qr.count_b)
      OR (v.choice = 'b' AND qr.count_b < qr.count_a)
    );

  -- Distinct categories voted in
  SELECT COALESCE(jsonb_agg(DISTINCT q.category), '[]'::jsonb) INTO v_categories
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id;

  -- Streak info
  SELECT current_streak, longest_streak
  INTO v_streak
  FROM user_streaks
  WHERE user_id = v_user_id;

  RETURN jsonb_build_object(
    'total_votes', v_total_votes,
    'majority_count', v_majority_count,
    'rebel_count', v_rebel_count,
    'categories', v_categories,
    'current_streak', COALESCE(v_streak.current_streak, 0),
    'longest_streak', COALESCE(v_streak.longest_streak, 0)
  );
END;
$$;
