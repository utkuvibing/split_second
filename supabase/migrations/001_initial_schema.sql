-- ============================================
-- Split Second - Initial Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  scheduled_date DATE NOT NULL UNIQUE,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_questions_scheduled_date ON questions (scheduled_date);

-- 2. Votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES questions(id),
  choice TEXT NOT NULL CHECK (choice IN ('a', 'b')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX idx_votes_question_choice ON votes (question_id, choice);
CREATE INDEX idx_votes_user_question ON votes (user_id, question_id);

-- 3. Results view (fast aggregation)
CREATE OR REPLACE VIEW question_results AS
SELECT
  question_id,
  COUNT(*) FILTER (WHERE choice = 'a') AS count_a,
  COUNT(*) FILTER (WHERE choice = 'b') AS count_b,
  COUNT(*) AS total_votes
FROM votes
GROUP BY question_id;

-- 4. RPC: Atomic vote + results (single round-trip)
CREATE OR REPLACE FUNCTION submit_vote_and_get_results(
  p_question_id UUID,
  p_choice TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count_a INT;
  v_count_b INT;
  v_total INT;
BEGIN
  -- Insert vote (will fail on duplicate due to UNIQUE constraint)
  INSERT INTO votes (user_id, question_id, choice)
  VALUES (auth.uid(), p_question_id, p_choice);

  -- Get aggregated results
  SELECT
    COUNT(*) FILTER (WHERE choice = 'a'),
    COUNT(*) FILTER (WHERE choice = 'b'),
    COUNT(*)
  INTO v_count_a, v_count_b, v_total
  FROM votes
  WHERE question_id = p_question_id;

  RETURN json_build_object(
    'count_a', v_count_a,
    'count_b', v_count_b,
    'total', v_total,
    'success', true
  );
END;
$$;

-- 5. RLS Policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Questions: everyone can read
CREATE POLICY "Questions are publicly readable"
  ON questions FOR SELECT
  USING (true);

-- Votes: anyone can read (for results view)
CREATE POLICY "Votes are publicly readable"
  ON votes FOR SELECT
  USING (true);

-- Votes: authenticated users can insert their own
CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies = nobody can change or remove votes
