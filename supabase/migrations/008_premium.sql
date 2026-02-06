-- 008_premium.sql
-- Premium monetization foundation: user profiles, cosmetics, equipped items

-- User profiles (extends anonymous auth with premium preferences)
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cosmetic purchases
CREATE TABLE user_cosmetics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  cosmetic_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, cosmetic_id)
);

-- Active cosmetic selections (equipped items)
CREATE TABLE user_equipped (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  theme_id TEXT DEFAULT 'default',
  frame_id TEXT DEFAULT 'none',
  vote_effect_id TEXT DEFAULT 'default',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies (user can only read/write own data)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_equipped ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_cosmetics" ON user_cosmetics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_equipped" ON user_equipped FOR ALL USING (auth.uid() = user_id);

-- RPC: Initialize profile on first check (or return existing)
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

-- RPC: Get user's owned cosmetics
CREATE OR REPLACE FUNCTION get_user_cosmetics()
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'cosmetic_id', cosmetic_id,
      'purchased_at', purchased_at
    )), '[]'::jsonb)
    FROM user_cosmetics
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Purchase a cosmetic (dev stub — no real payment validation)
CREATE OR REPLACE FUNCTION purchase_cosmetic(p_cosmetic_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO user_cosmetics (user_id, cosmetic_id)
  VALUES (auth.uid(), p_cosmetic_id)
  ON CONFLICT (user_id, cosmetic_id) DO NOTHING;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Equip a cosmetic to a slot
CREATE OR REPLACE FUNCTION equip_cosmetic(p_slot TEXT, p_cosmetic_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Ensure equipped row exists
  INSERT INTO user_equipped (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  IF p_slot = 'theme' THEN
    UPDATE user_equipped SET theme_id = p_cosmetic_id, updated_at = now() WHERE user_id = auth.uid();
  ELSIF p_slot = 'frame' THEN
    UPDATE user_equipped SET frame_id = p_cosmetic_id, updated_at = now() WHERE user_id = auth.uid();
  ELSIF p_slot = 'vote_effect' THEN
    UPDATE user_equipped SET vote_effect_id = p_cosmetic_id, updated_at = now() WHERE user_id = auth.uid();
  ELSE
    RETURN false;
  END IF;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
