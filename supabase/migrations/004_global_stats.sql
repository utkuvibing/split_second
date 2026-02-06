-- ============================================
-- Split Second - Global Stats (Daily vote count)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- RPC: Get today's global vote count
CREATE OR REPLACE FUNCTION get_daily_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_votes INT;
  v_total_voters INT;
BEGIN
  -- Count votes for today's question
  SELECT COUNT(*)
  INTO v_today_votes
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE q.scheduled_date = CURRENT_DATE;

  -- Total unique voters ever
  SELECT COUNT(DISTINCT user_id)
  INTO v_total_voters
  FROM votes;

  RETURN json_build_object(
    'today_votes', COALESCE(v_today_votes, 0),
    'total_voters', COALESCE(v_total_voters, 0)
  );
END;
$$;
