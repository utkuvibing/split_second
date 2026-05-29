-- 024_submit_vote_local_date.sql
-- Align daily vote/streak/coin logic with client local calendar date + guards

CREATE OR REPLACE FUNCTION submit_vote_and_get_results(
  p_question_id UUID,
  p_choice TEXT,
  p_vote_time REAL DEFAULT NULL,
  p_local_date DATE DEFAULT NULL
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
  v_today := COALESCE(p_local_date, CURRENT_DATE);

  IF p_local_date IS NOT NULL AND (
    p_local_date < CURRENT_DATE - INTERVAL '1 day'
    OR p_local_date > CURRENT_DATE + INTERVAL '1 day'
  ) THEN
    RETURN json_build_object(
      'count_a', 0,
      'count_b', 0,
      'total', 0,
      'success', false,
      'error', 'invalid_local_date'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM questions
    WHERE id = p_question_id
      AND scheduled_date = v_today
      AND is_active = true
  ) THEN
    RETURN json_build_object(
      'count_a', 0,
      'count_b', 0,
      'total', 0,
      'success', false,
      'error', 'question_not_for_date'
    );
  END IF;

  INSERT INTO votes (user_id, question_id, choice, vote_time_seconds)
  VALUES (v_user_id, p_question_id, p_choice, p_vote_time);

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

  v_coins_earned := 5;

  INSERT INTO user_profiles (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT last_vote_date, current_streak, longest_streak, total_votes
  INTO v_last_date, v_current_streak, v_longest_streak, v_total_votes
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
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

      v_coins_earned := v_coins_earned + 5;
    END IF;
  ELSE
    v_total_votes := v_total_votes + 1;
    v_streak_already_updated := (v_last_date = v_today);

    IF v_all_today_voted AND NOT v_streak_already_updated THEN
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

      v_coins_earned := v_coins_earned + 5;

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
      UPDATE user_streaks
      SET total_votes = v_total_votes,
          updated_at = now()
      WHERE user_id = v_user_id;
    END IF;
  END IF;

  UPDATE user_profiles
  SET coins = coins + v_coins_earned, updated_at = now()
  WHERE user_id = v_user_id;

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
