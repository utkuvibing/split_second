-- 015_mystery_boxes.sql
-- Mystery box / gacha system: variable rewards after votes

-- 1. Mystery boxes table
CREATE TABLE IF NOT EXISTS user_mystery_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  source TEXT NOT NULL DEFAULT 'vote',
  opened BOOLEAN DEFAULT false,
  reward_type TEXT,     -- 'coins' | 'cosmetic' | 'boost'
  reward_value TEXT,    -- coin amount or cosmetic_id or boost type
  created_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ
);

ALTER TABLE user_mystery_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_boxes" ON user_mystery_boxes FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_mystery_boxes_user ON user_mystery_boxes(user_id, opened);

-- 2. Pity counter on user_streaks
ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS votes_since_box INT DEFAULT 0;

-- 3. Active boosts table
CREATE TABLE IF NOT EXISTS user_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  boost_type TEXT NOT NULL CHECK (boost_type IN ('double_coins')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_boosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_boosts" ON user_boosts FOR ALL
  USING (auth.uid() = user_id);

-- 4. Check mystery box drop after a vote
-- 15% base chance + 5% per vote since last box. Guaranteed at 10 votes.
CREATE OR REPLACE FUNCTION check_mystery_box_drop()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_votes_since INT;
  v_chance FLOAT;
  v_roll FLOAT;
  v_rarity TEXT;
  v_rarity_roll FLOAT;
  v_box_id UUID;
BEGIN
  v_user_id := auth.uid();

  -- Get current pity counter
  SELECT COALESCE(votes_since_box, 0) INTO v_votes_since
  FROM user_streaks WHERE user_id = v_user_id;

  -- If no streak record yet, no drop
  IF v_votes_since IS NULL THEN
    RETURN json_build_object('dropped', false);
  END IF;

  -- Increment pity counter
  UPDATE user_streaks
  SET votes_since_box = COALESCE(votes_since_box, 0) + 1
  WHERE user_id = v_user_id;

  v_votes_since := v_votes_since + 1;

  -- Calculate drop chance: 15% base + 5% per vote, guaranteed at 10
  v_chance := 0.15 + (v_votes_since - 1) * 0.05;
  IF v_votes_since >= 10 THEN
    v_chance := 1.0;
  END IF;

  v_roll := random();
  IF v_roll > v_chance THEN
    RETURN json_build_object('dropped', false);
  END IF;

  -- Dropped! Reset pity counter
  UPDATE user_streaks SET votes_since_box = 0 WHERE user_id = v_user_id;

  -- Determine rarity: Common 60%, Rare 25%, Epic 10%, Legendary 5%
  v_rarity_roll := random();
  IF v_rarity_roll < 0.05 THEN
    v_rarity := 'legendary';
  ELSIF v_rarity_roll < 0.15 THEN
    v_rarity := 'epic';
  ELSIF v_rarity_roll < 0.40 THEN
    v_rarity := 'rare';
  ELSE
    v_rarity := 'common';
  END IF;

  -- Create unopened box
  INSERT INTO user_mystery_boxes (user_id, rarity, source)
  VALUES (v_user_id, v_rarity, 'vote')
  RETURNING id INTO v_box_id;

  RETURN json_build_object(
    'dropped', true,
    'box_id', v_box_id,
    'rarity', v_rarity
  );
END;
$$;

-- 5. Open a mystery box and determine reward
CREATE OR REPLACE FUNCTION open_mystery_box(p_box_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_box user_mystery_boxes%ROWTYPE;
  v_reward_type TEXT;
  v_reward_value TEXT;
  v_roll FLOAT;
  v_coin_amount INT;
  v_cosmetic_options TEXT[];
  v_cosmetic TEXT;
BEGIN
  v_user_id := auth.uid();

  -- Get the box
  SELECT * INTO v_box
  FROM user_mystery_boxes
  WHERE id = p_box_id AND user_id = v_user_id AND opened = false;

  IF v_box IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  v_roll := random();

  -- Determine reward based on rarity
  CASE v_box.rarity
    WHEN 'common' THEN
      -- 100% coins: 10-20
      v_reward_type := 'coins';
      v_coin_amount := 10 + floor(random() * 11)::int;
      v_reward_value := v_coin_amount::text;

    WHEN 'rare' THEN
      IF v_roll < 0.60 THEN
        -- 60% coins: 20-35
        v_reward_type := 'coins';
        v_coin_amount := 20 + floor(random() * 16)::int;
        v_reward_value := v_coin_amount::text;
      ELSE
        -- 40% cosmetic
        v_reward_type := 'cosmetic';
        v_cosmetic_options := ARRAY['aurora', 'galaxy'];
        v_cosmetic := v_cosmetic_options[1 + floor(random() * array_length(v_cosmetic_options, 1))::int];
        v_reward_value := v_cosmetic;
      END IF;

    WHEN 'epic' THEN
      IF v_roll < 0.40 THEN
        -- 40% coins: 35-50
        v_reward_type := 'coins';
        v_coin_amount := 35 + floor(random() * 16)::int;
        v_reward_value := v_coin_amount::text;
      ELSIF v_roll < 0.75 THEN
        -- 35% cosmetic
        v_reward_type := 'cosmetic';
        v_cosmetic_options := ARRAY['diamond', 'rainbow'];
        v_cosmetic := v_cosmetic_options[1 + floor(random() * array_length(v_cosmetic_options, 1))::int];
        v_reward_value := v_cosmetic;
      ELSE
        -- 25% boost
        v_reward_type := 'boost';
        v_reward_value := 'double_coins';
      END IF;

    WHEN 'legendary' THEN
      IF v_roll < 0.30 THEN
        -- 30% coins: 50-100
        v_reward_type := 'coins';
        v_coin_amount := 50 + floor(random() * 51)::int;
        v_reward_value := v_coin_amount::text;
      ELSIF v_roll < 0.80 THEN
        -- 50% cosmetic
        v_reward_type := 'cosmetic';
        v_cosmetic_options := ARRAY['phoenix', 'supernova'];
        v_cosmetic := v_cosmetic_options[1 + floor(random() * array_length(v_cosmetic_options, 1))::int];
        v_reward_value := v_cosmetic;
      ELSE
        -- 20% boost
        v_reward_type := 'boost';
        v_reward_value := 'double_coins';
      END IF;
  END CASE;

  -- Mark box as opened
  UPDATE user_mystery_boxes
  SET opened = true, opened_at = now(), reward_type = v_reward_type, reward_value = v_reward_value
  WHERE id = p_box_id;

  -- Apply reward
  IF v_reward_type = 'coins' THEN
    UPDATE user_profiles
    SET coins = COALESCE(coins, 0) + v_coin_amount
    WHERE user_id = v_user_id;

  ELSIF v_reward_type = 'cosmetic' THEN
    -- Grant cosmetic if not already owned
    INSERT INTO user_cosmetics (user_id, cosmetic_id)
    VALUES (v_user_id, v_reward_value)
    ON CONFLICT DO NOTHING;

  ELSIF v_reward_type = 'boost' THEN
    -- Create 1-hour double coins boost
    INSERT INTO user_boosts (user_id, boost_type, expires_at)
    VALUES (v_user_id, 'double_coins', now() + interval '1 hour');
  END IF;

  RETURN json_build_object(
    'success', true,
    'reward_type', v_reward_type,
    'reward_value', v_reward_value,
    'rarity', v_box.rarity
  );
END;
$$;

-- 6. Get unopened boxes (inventory)
CREATE OR REPLACE FUNCTION get_unopened_boxes()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(b) INTO v_result
  FROM (
    SELECT id, rarity, source, created_at
    FROM user_mystery_boxes
    WHERE user_id = auth.uid() AND opened = false
    ORDER BY created_at DESC
  ) b;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
