-- 018_avatars.sql
-- Avatar system: emoji avatars for user profiles
-- Dev coin boost: dev_add_coins RPC for testing

-- 1. Add avatar_id column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_id TEXT;

-- 2. RPC: Set avatar
CREATE OR REPLACE FUNCTION set_avatar(p_avatar_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET avatar_id = p_avatar_id
  WHERE user_id = auth.uid();

  RETURN json_build_object('success', true);
END;
$$;

-- 3. RPC: Dev add coins (for testing)
CREATE OR REPLACE FUNCTION dev_add_coins(p_amount INT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET coins = coins + p_amount
  WHERE user_id = auth.uid();

  RETURN json_build_object('success', true);
END;
$$;

-- 4. Update get_or_create_profile to return avatar_id
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

  -- Auto-assign friend code if missing
  UPDATE user_profiles
  SET friend_code = generate_friend_code()
  WHERE user_id = auth.uid() AND friend_code IS NULL;

  SELECT jsonb_build_object(
    'is_premium', p.is_premium,
    'premium_until', p.premium_until,
    'coins', COALESCE(p.coins, 0),
    'friend_code', p.friend_code,
    'display_name', p.display_name,
    'avatar_id', p.avatar_id,
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

-- 5. Update get_leaderboard to include avatar_id
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INT DEFAULT 50)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_entries JSONB;
  v_user_rank INT;
  v_user_entry JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(entry ORDER BY rn), '[]'::jsonb)
  INTO v_entries
  FROM (
    SELECT
      jsonb_build_object(
        'user_id', us.user_id::text,
        'current_streak', us.current_streak,
        'longest_streak', us.longest_streak,
        'total_votes', us.total_votes,
        'display_name', p.display_name,
        'avatar_id', p.avatar_id,
        'rank', ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC)
      ) AS entry,
      ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC) AS rn
    FROM user_streaks us
    LEFT JOIN user_profiles p ON p.user_id = us.user_id
    WHERE us.current_streak > 0
    ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC
    LIMIT p_limit
  ) sub;

  SELECT rank INTO v_user_rank
  FROM (
    SELECT
      user_id,
      ROW_NUMBER() OVER (ORDER BY current_streak DESC, longest_streak DESC, total_votes DESC) AS rank
    FROM user_streaks
    WHERE current_streak > 0
  ) ranked
  WHERE user_id = v_user_id;

  SELECT jsonb_build_object(
    'user_id', us.user_id::text,
    'current_streak', us.current_streak,
    'longest_streak', us.longest_streak,
    'total_votes', us.total_votes,
    'display_name', p.display_name,
    'avatar_id', p.avatar_id,
    'rank', COALESCE(v_user_rank, 0)
  )
  INTO v_user_entry
  FROM user_streaks us
  LEFT JOIN user_profiles p ON p.user_id = us.user_id
  WHERE us.user_id = v_user_id;

  RETURN jsonb_build_object(
    'entries', v_entries,
    'user_rank', COALESCE(v_user_rank, 0),
    'user_entry', v_user_entry
  );
END;
$$;

-- 6. Update get_friends_list to include avatar_id
CREATE OR REPLACE FUNCTION get_friends_list()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(friend_row) INTO v_result
  FROM (
    SELECT
      f.friend_id,
      p.friend_code,
      p.display_name AS friend_display_name,
      p.avatar_id AS friend_avatar_id,
      f.created_at,
      (
        SELECT CASE WHEN COUNT(*) >= 3 THEN
          ROUND(
            COUNT(*) FILTER (WHERE v1.choice = v2.choice)::NUMERIC
            / COUNT(*)::NUMERIC * 100
          )
        ELSE NULL END
        FROM votes v1
        JOIN votes v2 ON v2.question_id = v1.question_id AND v2.user_id = f.friend_id
        WHERE v1.user_id = v_user_id
      ) AS compatibility
    FROM friendships f
    JOIN user_profiles p ON p.user_id = f.friend_id
    WHERE f.user_id = v_user_id
    ORDER BY f.created_at DESC
  ) friend_row;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 7. Update get_friend_votes_for_question to include avatar_id
CREATE OR REPLACE FUNCTION get_friend_votes_for_question(p_question_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(fv) INTO v_result
  FROM (
    SELECT
      f.friend_id,
      p.friend_code,
      p.display_name AS friend_display_name,
      p.avatar_id AS friend_avatar_id,
      v.choice,
      v.created_at AS voted_at
    FROM friendships f
    JOIN user_profiles p ON p.user_id = f.friend_id
    LEFT JOIN votes v ON v.user_id = f.friend_id AND v.question_id = p_question_id
    WHERE f.user_id = v_user_id
    ORDER BY v.created_at DESC NULLS LAST
  ) fv;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
