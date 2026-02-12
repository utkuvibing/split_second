-- 020_avatar_tiers.sql
-- Purchasable (coin) and premium avatars

-- 1. Owned avatars table
CREATE TABLE IF NOT EXISTS user_owned_avatars (
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  avatar_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, avatar_id)
);

ALTER TABLE user_owned_avatars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own avatars" ON user_owned_avatars;
CREATE POLICY "Users can read own avatars" ON user_owned_avatars
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Purchase avatar RPC (atomic: check coins, deduct, insert ownership)
CREATE OR REPLACE FUNCTION purchase_avatar(p_avatar_id TEXT, p_price INT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coins INT;
  v_already_owned BOOLEAN;
BEGIN
  -- Check if already owned
  SELECT EXISTS(
    SELECT 1 FROM user_owned_avatars
    WHERE user_id = auth.uid() AND avatar_id = p_avatar_id
  ) INTO v_already_owned;

  IF v_already_owned THEN
    RETURN json_build_object('success', false, 'error', 'already_owned');
  END IF;

  -- Check balance
  SELECT coins INTO v_coins FROM user_profiles WHERE user_id = auth.uid();

  IF v_coins < p_price THEN
    RETURN json_build_object('success', false, 'error', 'insufficient_coins');
  END IF;

  -- Deduct coins
  UPDATE user_profiles SET coins = coins - p_price WHERE user_id = auth.uid();

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (auth.uid(), -p_price, 'avatar_purchase');

  -- Grant ownership
  INSERT INTO user_owned_avatars (user_id, avatar_id)
  VALUES (auth.uid(), p_avatar_id);

  RETURN json_build_object('success', true);
END;
$$;

-- 3. Get owned avatars RPC
CREATE OR REPLACE FUNCTION get_owned_avatars()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(avatar_id) INTO v_result
  FROM user_owned_avatars
  WHERE user_id = auth.uid();

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
