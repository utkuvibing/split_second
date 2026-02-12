-- 022_mystery_box_daily_limit.sql
-- Mystery box: max 1 drop per 24 hours, only after completing all 3 daily questions

CREATE OR REPLACE FUNCTION check_mystery_box_drop()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_last_drop TIMESTAMPTZ;
  v_votes_since INT;
  v_chance FLOAT;
  v_roll FLOAT;
  v_rarity TEXT;
  v_rarity_roll FLOAT;
  v_box_id UUID;
BEGIN
  v_user_id := auth.uid();

  -- 24-hour cooldown: check if a box was dropped in the last 24 hours
  SELECT MAX(created_at) INTO v_last_drop
  FROM user_mystery_boxes
  WHERE user_id = v_user_id;

  IF v_last_drop IS NOT NULL AND v_last_drop > now() - interval '24 hours' THEN
    RETURN json_build_object('dropped', false);
  END IF;

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
