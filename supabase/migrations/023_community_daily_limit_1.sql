-- 023_community_daily_limit_1.sql
-- Reduce community question submission limit from 3 to 1 per day

CREATE OR REPLACE FUNCTION submit_community_question(
  p_option_a TEXT,
  p_option_b TEXT,
  p_category TEXT DEFAULT 'community'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_today_count INT;
  v_question_id UUID;
  v_coins INT;
BEGIN
  v_user_id := auth.uid();

  -- Check daily submission limit (1 per day)
  SELECT COUNT(*) INTO v_today_count
  FROM community_questions
  WHERE author_id = v_user_id
    AND created_at::date = CURRENT_DATE;

  IF v_today_count >= 1 THEN
    RETURN json_build_object('success', false, 'error', 'daily_limit');
  END IF;

  -- Validate text length
  IF char_length(trim(p_option_a)) < 2 OR char_length(trim(p_option_a)) > 100
    OR char_length(trim(p_option_b)) < 2 OR char_length(trim(p_option_b)) > 100 THEN
    RETURN json_build_object('success', false, 'error', 'invalid_length');
  END IF;

  -- Check coin balance (row lock to prevent race condition)
  SELECT coins INTO v_coins
  FROM user_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF v_coins IS NULL OR v_coins < 50 THEN
    RETURN json_build_object('success', false, 'error', 'insufficient_coins');
  END IF;

  -- Insert the question
  INSERT INTO community_questions (author_id, option_a, option_b, category)
  VALUES (v_user_id, trim(p_option_a), trim(p_option_b), p_category)
  RETURNING id INTO v_question_id;

  -- Deduct coins
  UPDATE user_profiles SET coins = coins - 50 WHERE user_id = v_user_id;

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, -50, 'submit_question');

  RETURN json_build_object('success', true, 'question_id', v_question_id);
END;
$$;
