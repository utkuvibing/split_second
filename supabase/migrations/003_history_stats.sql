-- ============================================
-- Split Second - Vote History & User Stats
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. RPC: Get vote history for current user
CREATE OR REPLACE FUNCTION get_vote_history()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_to_json(t) ORDER BY t.scheduled_date DESC)
  INTO v_result
  FROM (
    SELECT
      q.id AS question_id,
      q.question_text,
      q.option_a,
      q.option_b,
      q.scheduled_date,
      q.category,
      v.choice AS user_choice,
      v.created_at AS voted_at,
      COALESCE(qr.count_a, 0) AS count_a,
      COALESCE(qr.count_b, 0) AS count_b,
      COALESCE(qr.total_votes, 0) AS total
    FROM votes v
    JOIN questions q ON q.id = v.question_id
    LEFT JOIN question_results qr ON qr.question_id = q.id
    WHERE v.user_id = auth.uid()
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 2. RPC: Get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_votes INT;
  v_majority_count INT;
  v_majority_percent INT;
  v_top_category TEXT;
  v_streak_current INT;
  v_streak_longest INT;
BEGIN
  -- Total votes
  SELECT COUNT(*)
  INTO v_total_votes
  FROM votes
  WHERE user_id = auth.uid();

  -- How many times user voted with the majority
  SELECT COUNT(*)
  INTO v_majority_count
  FROM votes v
  JOIN question_results qr ON qr.question_id = v.question_id
  WHERE v.user_id = auth.uid()
    AND (
      (v.choice = 'a' AND qr.count_a >= qr.count_b)
      OR (v.choice = 'b' AND qr.count_b >= qr.count_a)
    );

  v_majority_percent := CASE WHEN v_total_votes > 0
    THEN ROUND((v_majority_count::NUMERIC / v_total_votes) * 100)
    ELSE 0
  END;

  -- Most voted category
  SELECT q.category
  INTO v_top_category
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = auth.uid()
  GROUP BY q.category
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- Streak info
  SELECT current_streak, longest_streak
  INTO v_streak_current, v_streak_longest
  FROM user_streaks
  WHERE user_id = auth.uid();

  RETURN json_build_object(
    'total_votes', v_total_votes,
    'majority_percent', v_majority_percent,
    'top_category', COALESCE(v_top_category, 'N/A'),
    'current_streak', COALESCE(v_streak_current, 0),
    'longest_streak', COALESCE(v_streak_longest, 0)
  );
END;
$$;
