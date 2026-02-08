-- 010_personality.sql
-- Personality profile system: analyze votes to determine decision-making type

-- 1. Add vote_time_seconds to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS vote_time_seconds REAL;

-- 2. User personality table
CREATE TABLE IF NOT EXISTS user_personality (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  personality_type TEXT NOT NULL DEFAULT 'unknown',
  conformity_score REAL DEFAULT 0,
  speed_score REAL DEFAULT 0,
  diversity_score REAL DEFAULT 0,
  courage_score REAL DEFAULT 0,
  votes_analyzed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_personality ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_personality" ON user_personality FOR ALL USING (auth.uid() = user_id);

-- 3. Get personality context: raw data for client-side calculation
CREATE OR REPLACE FUNCTION get_personality_context()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_total_votes INT;
  v_majority_count INT;
  v_avg_vote_time REAL;
  v_unique_categories INT;
  v_minority_in_skewed INT;
  v_skewed_questions INT;
  v_personality RECORD;
BEGIN
  v_user_id := auth.uid();

  -- Total votes
  SELECT COUNT(*) INTO v_total_votes
  FROM votes WHERE user_id = v_user_id;

  IF v_total_votes = 0 THEN
    RETURN json_build_object('total_votes', 0);
  END IF;

  -- Majority count: how often user voted with the majority
  SELECT COUNT(*) INTO v_majority_count
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice
    FROM votes GROUP BY question_id
  ) m ON m.question_id = v.question_id AND m.majority_choice = v.choice
  WHERE v.user_id = v_user_id;

  -- Average vote time (only for votes that have time recorded)
  SELECT COALESCE(AVG(vote_time_seconds), 5.0) INTO v_avg_vote_time
  FROM votes WHERE user_id = v_user_id AND vote_time_seconds IS NOT NULL;

  -- Unique categories voted in
  SELECT COUNT(DISTINCT q.category) INTO v_unique_categories
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id;

  -- Courage: minority votes in skewed questions (65%+ majority)
  SELECT
    COUNT(*) FILTER (WHERE v.choice != sq.majority_choice),
    COUNT(*)
  INTO v_minority_in_skewed, v_skewed_questions
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice,
      GREATEST(
        COUNT(*) FILTER (WHERE choice = 'a'),
        COUNT(*) FILTER (WHERE choice = 'b')
      )::REAL / NULLIF(COUNT(*), 0) AS majority_pct
    FROM votes GROUP BY question_id
    HAVING GREATEST(
      COUNT(*) FILTER (WHERE choice = 'a'),
      COUNT(*) FILTER (WHERE choice = 'b')
    )::REAL / NULLIF(COUNT(*), 0) >= 0.65
  ) sq ON sq.question_id = v.question_id
  WHERE v.user_id = v_user_id;

  -- Get existing personality if any
  SELECT personality_type, votes_analyzed
  INTO v_personality
  FROM user_personality WHERE user_id = v_user_id;

  RETURN json_build_object(
    'total_votes', v_total_votes,
    'majority_count', v_majority_count,
    'avg_vote_time', v_avg_vote_time,
    'unique_categories', v_unique_categories,
    'minority_in_skewed', COALESCE(v_minority_in_skewed, 0),
    'skewed_questions', COALESCE(v_skewed_questions, 0),
    'current_type', COALESCE(v_personality.personality_type, 'unknown'),
    'votes_analyzed', COALESCE(v_personality.votes_analyzed, 0)
  );
END;
$$;

-- 4. Save personality (called from client after calculation)
CREATE OR REPLACE FUNCTION save_personality(
  p_type TEXT,
  p_conformity REAL,
  p_speed REAL,
  p_diversity REAL,
  p_courage REAL,
  p_votes_analyzed INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  INSERT INTO user_personality (user_id, personality_type, conformity_score, speed_score, diversity_score, courage_score, votes_analyzed, updated_at)
  VALUES (v_user_id, p_type, p_conformity, p_speed, p_diversity, p_courage, p_votes_analyzed, now())
  ON CONFLICT (user_id) DO UPDATE SET
    personality_type = EXCLUDED.personality_type,
    conformity_score = EXCLUDED.conformity_score,
    speed_score = EXCLUDED.speed_score,
    diversity_score = EXCLUDED.diversity_score,
    courage_score = EXCLUDED.courage_score,
    votes_analyzed = EXCLUDED.votes_analyzed,
    updated_at = now();

  RETURN json_build_object('success', true);
END;
$$;

-- 5. Update submit_vote_and_get_results to accept vote_time
CREATE OR REPLACE FUNCTION submit_vote_and_get_results(
  p_question_id UUID,
  p_choice TEXT,
  p_vote_time REAL DEFAULT NULL
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
  v_coins_earned INT := 0;
  v_total_coins INT;
  v_is_first_today BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  v_today := CURRENT_DATE;

  -- Insert vote with optional time
  INSERT INTO votes (user_id, question_id, choice, vote_time_seconds)
  VALUES (v_user_id, p_question_id, p_choice, p_vote_time);

  -- Check if this is the first vote today (for coin reward)
  SELECT NOT EXISTS(
    SELECT 1 FROM votes
    WHERE user_id = v_user_id
      AND question_id != p_question_id
      AND created_at::date = v_today
  ) INTO v_is_first_today;

  -- Get or create streak record
  SELECT last_vote_date, current_streak, longest_streak, total_votes
  INTO v_last_date, v_current_streak, v_longest_streak, v_total_votes
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_vote_date, total_votes)
    VALUES (v_user_id, 1, 1, v_today, 1);
    v_current_streak := 1;
    v_longest_streak := 1;
    v_total_votes := 1;
  ELSE
    IF v_last_date = v_today THEN
      v_total_votes := v_total_votes + 1;
    ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
      v_current_streak := v_current_streak + 1;
      v_total_votes := v_total_votes + 1;
      IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
      END IF;
    ELSE
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

  -- Award coins (only once per day)
  IF v_is_first_today THEN
    v_coins_earned := 10;

    IF v_current_streak = 3 THEN
      v_coins_earned := v_coins_earned + 5;
    ELSIF v_current_streak = 7 THEN
      v_coins_earned := v_coins_earned + 15;
    ELSIF v_current_streak = 14 THEN
      v_coins_earned := v_coins_earned + 25;
    ELSIF v_current_streak = 30 THEN
      v_coins_earned := v_coins_earned + 50;
    END IF;

    INSERT INTO user_profiles (user_id)
    VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    UPDATE user_profiles
    SET coins = coins + v_coins_earned, updated_at = now()
    WHERE user_id = v_user_id;

    INSERT INTO coin_transactions (user_id, amount, reason)
    VALUES (v_user_id, v_coins_earned,
      CASE
        WHEN v_current_streak = 3 THEN 'daily_vote+streak_3'
        WHEN v_current_streak = 7 THEN 'daily_vote+streak_7'
        WHEN v_current_streak = 14 THEN 'daily_vote+streak_14'
        WHEN v_current_streak = 30 THEN 'daily_vote+streak_30'
        ELSE 'daily_vote'
      END
    );
  END IF;

  SELECT COALESCE(coins, 0) INTO v_total_coins
  FROM user_profiles WHERE user_id = v_user_id;

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
    'total_votes', v_total_votes,
    'coins_earned', v_coins_earned,
    'total_coins', v_total_coins
  );
END;
$$;
