-- ============================================
-- Split Second - Streak System
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. User streaks table
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_vote_date DATE,
  total_votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS for user_streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Updated RPC: Atomic vote + streak update + results
CREATE OR REPLACE FUNCTION submit_vote_and_get_results(
  p_question_id UUID,
  p_choice TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count_a INT;
  v_count_b INT;
  v_total INT;
  v_user_id UUID;
  v_today DATE;
  v_last_date DATE;
  v_current_streak INT;
  v_longest_streak INT;
  v_total_votes INT;
BEGIN
  v_user_id := auth.uid();
  v_today := CURRENT_DATE;

  -- Insert vote (will fail on duplicate due to UNIQUE constraint)
  INSERT INTO votes (user_id, question_id, choice)
  VALUES (v_user_id, p_question_id, p_choice);

  -- Get or create streak record
  SELECT last_vote_date, current_streak, longest_streak, total_votes
  INTO v_last_date, v_current_streak, v_longest_streak, v_total_votes
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    -- First time voter
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_vote_date, total_votes)
    VALUES (v_user_id, 1, 1, v_today, 1);
    v_current_streak := 1;
    v_longest_streak := 1;
    v_total_votes := 1;
  ELSE
    -- Update streak
    IF v_last_date = v_today THEN
      -- Already voted today, just increment total
      v_total_votes := v_total_votes + 1;
    ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
      -- Consecutive day
      v_current_streak := v_current_streak + 1;
      v_total_votes := v_total_votes + 1;
      IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
      END IF;
    ELSE
      -- Streak broken
      v_current_streak := 1;
      v_total_votes := v_total_votes + 1;
    END IF;

    UPDATE user_streaks
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_vote_date = v_today,
        total_votes = v_total_votes,
        updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  -- Get aggregated results
  SELECT
    COUNT(*) FILTER (WHERE choice = 'a'),
    COUNT(*) FILTER (WHERE choice = 'b'),
    COUNT(*)
  INTO v_count_a, v_count_b, v_total
  FROM votes
  WHERE question_id = p_question_id;

  RETURN json_build_object(
    'count_a', v_count_a,
    'count_b', v_count_b,
    'total', v_total,
    'success', true,
    'current_streak', v_current_streak,
    'longest_streak', v_longest_streak,
    'total_votes', v_total_votes
  );
END;
$$;
