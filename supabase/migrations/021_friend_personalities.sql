-- 021_friend_personalities.sql
-- RPC to fetch friends list with their personality axes for compatibility matching

CREATE OR REPLACE FUNCTION get_friends_with_personality()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(row_to_json(t))
  INTO v_result
  FROM (
    SELECT
      f.friend_id,
      p.friend_code,
      p.display_name AS friend_display_name,
      p.avatar_id AS friend_avatar_id,
      CASE
        WHEN up.personality_type IS NOT NULL AND up.personality_type != 'unknown'
        THEN json_build_object(
          'conformity', ROUND(up.conformity_score::numeric),
          'speed', ROUND(up.speed_score::numeric),
          'diversity', ROUND(up.diversity_score::numeric),
          'courage', ROUND(up.courage_score::numeric)
        )
        ELSE NULL
      END AS axes
    FROM (
      -- Get friends where I am user_id
      SELECT friend_id FROM friendships WHERE user_id = v_user_id
      UNION
      -- Get friends where I am friend_id
      SELECT user_id AS friend_id FROM friendships WHERE friend_id = v_user_id
    ) f
    JOIN user_profiles p ON p.user_id = f.friend_id
    LEFT JOIN user_personality up ON up.user_id = f.friend_id
    ORDER BY p.display_name NULLS LAST, p.friend_code
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
