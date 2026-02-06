-- RPC: get_leaderboard
-- Returns top N users by current streak, plus the calling user's rank
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
        'rank', ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC)
      ) AS entry,
      ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC, us.total_votes DESC) AS rn
    FROM user_streaks us
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
    'rank', COALESCE(v_user_rank, 0)
  )
  INTO v_user_entry
  FROM user_streaks us
  WHERE us.user_id = v_user_id;

  RETURN jsonb_build_object(
    'entries', v_entries,
    'user_rank', COALESCE(v_user_rank, 0),
    'user_entry', v_user_entry
  );
END;
$$;
