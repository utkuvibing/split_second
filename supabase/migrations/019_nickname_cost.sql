-- 019_nickname_cost.sql
-- Nickname changes cost coins (first set is free)

CREATE OR REPLACE FUNCTION set_display_name(p_name TEXT, p_cost INT DEFAULT 0)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trimmed TEXT;
  v_current_name TEXT;
  v_coins INT;
BEGIN
  v_trimmed := trim(p_name);

  IF char_length(v_trimmed) < 2 OR char_length(v_trimmed) > 16 THEN
    RETURN json_build_object('success', false, 'error', 'invalid_length');
  END IF;

  -- Check if this is a rename (display_name already set)
  SELECT display_name, coins INTO v_current_name, v_coins
  FROM user_profiles WHERE user_id = auth.uid();

  -- If already has a name and cost > 0, deduct coins
  IF v_current_name IS NOT NULL AND p_cost > 0 THEN
    IF v_coins < p_cost THEN
      RETURN json_build_object('success', false, 'error', 'insufficient_coins');
    END IF;

    UPDATE user_profiles
    SET display_name = v_trimmed, coins = coins - p_cost
    WHERE user_id = auth.uid();

    -- Log transaction
    INSERT INTO coin_transactions (user_id, amount, reason)
    VALUES (auth.uid(), -p_cost, 'nickname_change');
  ELSE
    UPDATE user_profiles
    SET display_name = v_trimmed
    WHERE user_id = auth.uid();
  END IF;

  RETURN json_build_object('success', true, 'display_name', v_trimmed);
END;
$$;
