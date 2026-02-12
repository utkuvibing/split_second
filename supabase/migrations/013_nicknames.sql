-- 013_nicknames.sql
-- Custom display names (nicknames) for social features

-- 1. Add display_name column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Constraint: 2-16 characters when set (safe re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_display_name_length'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT check_display_name_length
      CHECK (display_name IS NULL OR (char_length(trim(display_name)) >= 2 AND char_length(trim(display_name)) <= 16));
  END IF;
END;
$$;

-- 2. RPC: Set display name with validation
CREATE OR REPLACE FUNCTION set_display_name(p_name TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trimmed TEXT;
BEGIN
  v_trimmed := trim(p_name);

  IF char_length(v_trimmed) < 2 OR char_length(v_trimmed) > 16 THEN
    RETURN json_build_object('success', false, 'error', 'invalid_length');
  END IF;

  UPDATE user_profiles
  SET display_name = v_trimmed
  WHERE user_id = auth.uid();

  RETURN json_build_object('success', true, 'display_name', v_trimmed);
END;
$$;

-- 3. Update get_or_create_profile to return display_name
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

-- 4. Update get_leaderboard to include display_name
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
  -- Top N by current_streak (desc), then longest_streak (desc)
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
        'rank', ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC)
      ) AS entry,
      ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC) AS rn
    FROM user_streaks us
    LEFT JOIN user_profiles p ON p.user_id = us.user_id
    WHERE us.current_streak > 0
    ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC
    LIMIT p_limit
  ) sub;

  -- User's own rank (even if not in top N)
  SELECT rank INTO v_user_rank
  FROM (
    SELECT
      user_id,
      ROW_NUMBER() OVER (ORDER BY current_streak DESC, longest_streak DESC, total_votes DESC) AS rank
    FROM user_streaks
    WHERE current_streak > 0
  ) ranked
  WHERE user_id = v_user_id;

  -- User's entry
  SELECT jsonb_build_object(
    'user_id', us.user_id::text,
    'current_streak', us.current_streak,
    'longest_streak', us.longest_streak,
    'total_votes', us.total_votes,
    'display_name', p.display_name,
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

-- 5. Update get_friends_list to include display_name
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
      f.created_at,
      -- Compatibility: matching votes / common questions
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

-- 6. Update get_friend_votes_for_question to include display_name
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
