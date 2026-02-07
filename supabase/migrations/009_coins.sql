-- 009_coins.sql
-- Coin economy system: earn coins by voting/streaks, spend on cosmetics

-- 1. Add coins column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;

-- 2. Coin transaction history
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_coin_txns" ON coin_transactions FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_coin_transactions_user ON coin_transactions(user_id);

-- 3. Update submit_vote_and_get_results to award coins
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
  v_coins_earned INT := 0;
  v_total_coins INT;
  v_is_first_today BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  v_today := CURRENT_DATE;

  -- Insert vote (will fail on duplicate due to UNIQUE constraint)
  INSERT INTO votes (user_id, question_id, choice)
  VALUES (v_user_id, p_question_id, p_choice);

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
    -- Base daily vote reward
    v_coins_earned := 10;

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

    -- Ensure profile exists
    INSERT INTO user_profiles (user_id)
    VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Add coins
    UPDATE user_profiles
    SET coins = coins + v_coins_earned, updated_at = now()
    WHERE user_id = v_user_id;

    -- Log transaction
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

  -- Get current coin balance
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

-- 4. Purchase cosmetic with coins (atomic)
CREATE OR REPLACE FUNCTION purchase_cosmetic_with_coins(
  p_cosmetic_id TEXT,
  p_price INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_coins INT;
BEGIN
  v_user_id := auth.uid();

  -- Ensure profile exists
  INSERT INTO user_profiles (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get current balance (lock row for update)
  SELECT coins INTO v_current_coins
  FROM user_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  -- Check sufficient balance
  IF v_current_coins < p_price THEN
    RETURN json_build_object(
      'success', false,
      'error', 'insufficient_coins',
      'current_coins', v_current_coins
    );
  END IF;

  -- Check not already owned
  IF EXISTS(SELECT 1 FROM user_cosmetics WHERE user_id = v_user_id AND cosmetic_id = p_cosmetic_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'already_owned',
      'current_coins', v_current_coins
    );
  END IF;

  -- Deduct coins
  UPDATE user_profiles
  SET coins = coins - p_price, updated_at = now()
  WHERE user_id = v_user_id;

  -- Add cosmetic
  INSERT INTO user_cosmetics (user_id, cosmetic_id)
  VALUES (v_user_id, p_cosmetic_id);

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, -p_price, 'purchase_' || p_cosmetic_id);

  RETURN json_build_object(
    'success', true,
    'current_coins', v_current_coins - p_price
  );
END;
$$;

-- 5. Get coin balance
CREATE OR REPLACE FUNCTION get_coin_balance()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coins INT;
BEGIN
  INSERT INTO user_profiles (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT COALESCE(coins, 0) INTO v_coins
  FROM user_profiles WHERE user_id = auth.uid();

  RETURN json_build_object('coins', v_coins);
END;
$$;

-- 6. Award coins for badge unlock (called from client when badge is unlocked)
CREATE OR REPLACE FUNCTION award_badge_coins()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_new_coins INT;
BEGIN
  v_user_id := auth.uid();

  INSERT INTO user_profiles (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE user_profiles
  SET coins = coins + 20, updated_at = now()
  WHERE user_id = v_user_id;

  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, 20, 'badge_unlock');

  SELECT coins INTO v_new_coins
  FROM user_profiles WHERE user_id = v_user_id;

  RETURN json_build_object('success', true, 'coins', v_new_coins);
END;
$$;

-- 7. Award coins for sharing result
CREATE OR REPLACE FUNCTION award_share_coins()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_today DATE;
  v_already_shared BOOLEAN;
  v_new_coins INT;
BEGIN
  v_user_id := auth.uid();
  v_today := CURRENT_DATE;

  -- Only award once per day for sharing
  SELECT EXISTS(
    SELECT 1 FROM coin_transactions
    WHERE user_id = v_user_id
      AND reason = 'share'
      AND created_at::date = v_today
  ) INTO v_already_shared;

  IF v_already_shared THEN
    SELECT COALESCE(coins, 0) INTO v_new_coins
    FROM user_profiles WHERE user_id = v_user_id;
    RETURN json_build_object('success', false, 'coins', v_new_coins);
  END IF;

  INSERT INTO user_profiles (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE user_profiles
  SET coins = coins + 5, updated_at = now()
  WHERE user_id = v_user_id;

  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, 5, 'share');

  SELECT coins INTO v_new_coins
  FROM user_profiles WHERE user_id = v_user_id;

  RETURN json_build_object('success', true, 'coins', v_new_coins);
END;
$$;

-- 8. Update get_or_create_profile to include coins
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

  SELECT jsonb_build_object(
    'is_premium', p.is_premium,
    'premium_until', p.premium_until,
    'coins', COALESCE(p.coins, 0),
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
