-- 012_multiple_questions.sql
-- Support 3 daily questions with time slots (morning/afternoon/evening)

-- 1. Add time_slot column to questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_slot TEXT DEFAULT 'morning';

-- 2. Drop the old unique constraint on scheduled_date (if exists)
--    The constraint name may vary; drop by finding it
DO $$
BEGIN
  -- Drop unique index on scheduled_date if it exists
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'questions'
      AND indexdef LIKE '%scheduled_date%'
      AND indexdef LIKE '%UNIQUE%'
  ) THEN
    -- Find and drop the constraint
    EXECUTE (
      SELECT 'ALTER TABLE questions DROP CONSTRAINT ' || conname
      FROM pg_constraint
      WHERE conrelid = 'questions'::regclass
        AND contype = 'u'
        AND array_length(conkey, 1) = 1
        AND conkey[1] = (
          SELECT attnum FROM pg_attribute
          WHERE attrelid = 'questions'::regclass AND attname = 'scheduled_date'
        )
      LIMIT 1
    );
  END IF;
END $$;

-- Also try dropping unique index directly if it's an index, not a constraint
DROP INDEX IF EXISTS questions_scheduled_date_key;

-- 3. Add CHECK constraint on time_slot
ALTER TABLE questions ADD CONSTRAINT questions_time_slot_check
  CHECK (time_slot IN ('morning', 'afternoon', 'evening'));

-- 4. Add composite unique constraint (one question per slot per day)
ALTER TABLE questions ADD CONSTRAINT questions_scheduled_date_time_slot_key
  UNIQUE (scheduled_date, time_slot);

-- 5. Update existing questions to have morning slot (already set by default)
UPDATE questions SET time_slot = 'morning' WHERE time_slot IS NULL;

-- 6. Update RPC to support multi-question coin/streak logic
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
  v_today_questions INT;
  v_today_voted INT;
  v_all_today_voted BOOLEAN;
  v_streak_already_updated BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  v_today := CURRENT_DATE;

  -- Insert vote with optional time
  INSERT INTO votes (user_id, question_id, choice, vote_time_seconds)
  VALUES (v_user_id, p_question_id, p_choice, p_vote_time);

  -- Count today's questions and how many the user has voted on
  SELECT COUNT(*) INTO v_today_questions
  FROM questions
  WHERE scheduled_date = v_today AND is_active = true;

  SELECT COUNT(DISTINCT v.question_id) INTO v_today_voted
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id
    AND q.scheduled_date = v_today
    AND q.is_active = true;

  v_all_today_voted := (v_today_voted >= v_today_questions AND v_today_questions > 0);

  -- Award 5 coins per question vote
  v_coins_earned := 5;

  INSERT INTO user_profiles (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get or create streak record
  SELECT last_vote_date, current_streak, longest_streak, total_votes
  INTO v_last_date, v_current_streak, v_longest_streak, v_total_votes
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    -- New user: create streak record, don't update streak until all voted
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_vote_date, total_votes)
    VALUES (v_user_id, 0, 0, NULL, 1);
    v_current_streak := 0;
    v_longest_streak := 0;
    v_total_votes := 1;

    IF v_all_today_voted THEN
      v_current_streak := 1;
      v_longest_streak := 1;

      UPDATE user_streaks
      SET current_streak = 1,
          longest_streak = 1,
          last_vote_date = v_today,
          total_votes = 1,
          updated_at = now()
      WHERE user_id = v_user_id;

      -- Streak bonus for completing the day
      v_coins_earned := v_coins_earned + 5;
    END IF;
  ELSE
    v_total_votes := v_total_votes + 1;
    v_streak_already_updated := (v_last_date = v_today);

    IF v_all_today_voted AND NOT v_streak_already_updated THEN
      -- All questions answered today, and streak not yet updated today
      IF v_last_date = v_today - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
      ELSIF v_last_date IS NULL OR v_last_date < v_today - INTERVAL '1 day' THEN
        v_current_streak := 1;
      END IF;

      IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
      END IF;

      UPDATE user_streaks
      SET current_streak = v_current_streak,
          longest_streak = v_longest_streak,
          last_vote_date = v_today,
          total_votes = v_total_votes,
          updated_at = now()
      WHERE user_id = v_user_id;

      -- Day completion bonus
      v_coins_earned := v_coins_earned + 5;

      -- Streak milestone bonuses
      IF v_current_streak = 3 THEN
        v_coins_earned := v_coins_earned + 5;
      ELSIF v_current_streak = 7 THEN
        v_coins_earned := v_coins_earned + 15;
      ELSIF v_current_streak = 14 THEN
        v_coins_earned := v_coins_earned + 25;
      ELSIF v_current_streak = 30 THEN
        v_coins_earned := v_coins_earned + 50;
      END IF;
    ELSE
      -- Just update total_votes
      UPDATE user_streaks
      SET total_votes = v_total_votes,
          updated_at = now()
      WHERE user_id = v_user_id;
    END IF;
  END IF;

  -- Update coins
  UPDATE user_profiles
  SET coins = coins + v_coins_earned, updated_at = now()
  WHERE user_id = v_user_id;

  -- Record coin transaction
  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, v_coins_earned,
    CASE
      WHEN v_all_today_voted AND v_current_streak = 3 THEN 'question_vote+day_complete+streak_3'
      WHEN v_all_today_voted AND v_current_streak = 7 THEN 'question_vote+day_complete+streak_7'
      WHEN v_all_today_voted AND v_current_streak = 14 THEN 'question_vote+day_complete+streak_14'
      WHEN v_all_today_voted AND v_current_streak = 30 THEN 'question_vote+day_complete+streak_30'
      WHEN v_all_today_voted THEN 'question_vote+day_complete'
      ELSE 'question_vote'
    END
  );

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
    'total_coins', v_total_coins,
    'votes_today', v_today_voted,
    'all_today_voted', v_all_today_voted
  );
END;
$$;
