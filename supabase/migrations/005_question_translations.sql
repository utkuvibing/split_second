-- ============================================
-- Split Second - Question Translations
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Add translation columns
ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_text_tr TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_a_tr TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_b_tr TEXT;

-- 2. Update get_vote_history() to include TR columns
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
      q.question_text_tr,
      q.option_a_tr,
      q.option_b_tr,
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
