-- 016_community_questions.sql
-- Community-submitted questions with voting and moderation

-- 1. Community questions table
CREATE TABLE IF NOT EXISTS community_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  category TEXT DEFAULT 'community',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'promoted')),
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  report_count INT DEFAULT 0,
  promoted_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_community_questions" ON community_questions;
CREATE POLICY "public_read_community_questions" ON community_questions
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "users_create_community_questions" ON community_questions;
CREATE POLICY "users_create_community_questions" ON community_questions
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_community_questions_status ON community_questions(status);
CREATE INDEX IF NOT EXISTS idx_community_questions_author ON community_questions(author_id);

-- 2. Community votes table (up/down/report)
CREATE TABLE IF NOT EXISTS community_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question_id UUID NOT NULL REFERENCES community_questions(id),
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down', 'report')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_own_community_votes" ON community_votes;
CREATE POLICY "users_own_community_votes" ON community_votes FOR ALL
  USING (auth.uid() = user_id);

-- 3. Submit a community question (max 3 per day, costs 50 coins)
CREATE OR REPLACE FUNCTION submit_community_question(
  p_option_a TEXT,
  p_option_b TEXT,
  p_category TEXT DEFAULT 'community'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_today_count INT;
  v_question_id UUID;
  v_coins INT;
BEGIN
  v_user_id := auth.uid();

  -- Check daily submission limit
  SELECT COUNT(*) INTO v_today_count
  FROM community_questions
  WHERE author_id = v_user_id
    AND created_at::date = CURRENT_DATE;

  IF v_today_count >= 3 THEN
    RETURN json_build_object('success', false, 'error', 'daily_limit');
  END IF;

  -- Validate text length
  IF char_length(trim(p_option_a)) < 2 OR char_length(trim(p_option_a)) > 100
    OR char_length(trim(p_option_b)) < 2 OR char_length(trim(p_option_b)) > 100 THEN
    RETURN json_build_object('success', false, 'error', 'invalid_length');
  END IF;

  -- Check coin balance (row lock to prevent race condition)
  SELECT coins INTO v_coins
  FROM user_profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF v_coins IS NULL OR v_coins < 50 THEN
    RETURN json_build_object('success', false, 'error', 'insufficient_coins');
  END IF;

  -- Insert the question
  INSERT INTO community_questions (author_id, option_a, option_b, category)
  VALUES (v_user_id, trim(p_option_a), trim(p_option_b), p_category)
  RETURNING id INTO v_question_id;

  -- Deduct coins
  UPDATE user_profiles SET coins = coins - 50 WHERE user_id = v_user_id;

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, reason)
  VALUES (v_user_id, -50, 'submit_question');

  RETURN json_build_object('success', true, 'question_id', v_question_id);
END;
$$;

-- 4. Vote on a community question (up/down/report)
CREATE OR REPLACE FUNCTION vote_community_question(
  p_question_id UUID,
  p_vote_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_question community_questions%ROWTYPE;
BEGIN
  v_user_id := auth.uid();

  -- Get the question
  SELECT * INTO v_question
  FROM community_questions WHERE id = p_question_id;

  IF v_question IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  -- Can't vote on own question
  IF v_question.author_id = v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'own_question');
  END IF;

  -- Insert vote (upsert)
  INSERT INTO community_votes (user_id, question_id, vote_type)
  VALUES (v_user_id, p_question_id, p_vote_type)
  ON CONFLICT (user_id, question_id) DO UPDATE SET vote_type = p_vote_type;

  -- Update counters
  UPDATE community_questions
  SET
    upvotes = (SELECT COUNT(*) FROM community_votes WHERE question_id = p_question_id AND vote_type = 'up'),
    downvotes = (SELECT COUNT(*) FROM community_votes WHERE question_id = p_question_id AND vote_type = 'down'),
    report_count = (SELECT COUNT(*) FROM community_votes WHERE question_id = p_question_id AND vote_type = 'report')
  WHERE id = p_question_id;

  -- Auto-reject if 5+ reports
  UPDATE community_questions
  SET status = 'rejected'
  WHERE id = p_question_id AND report_count >= 5 AND status = 'pending';

  RETURN json_build_object('success', true);
END;
$$;

-- 5. Get community questions feed (Hot/New/Top)
CREATE OR REPLACE FUNCTION get_community_questions(
  p_sort TEXT DEFAULT 'hot',
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  SELECT json_agg(q) INTO v_result
  FROM (
    SELECT
      cq.id,
      cq.option_a,
      cq.option_b,
      cq.category,
      cq.upvotes,
      cq.downvotes,
      cq.created_at,
      p.display_name AS author_display_name,
      p.friend_code AS author_friend_code,
      cv.vote_type AS user_vote
    FROM community_questions cq
    LEFT JOIN user_profiles p ON p.user_id = cq.author_id
    LEFT JOIN community_votes cv ON cv.question_id = cq.id AND cv.user_id = v_user_id
    WHERE cq.status IN ('pending', 'approved')
    ORDER BY
      CASE p_sort
        WHEN 'new' THEN extract(epoch from cq.created_at)
        WHEN 'top' THEN cq.upvotes - cq.downvotes
        ELSE -- 'hot': upvotes weighted by recency
          (cq.upvotes - cq.downvotes)::float /
          GREATEST(1.0, extract(epoch from (now() - cq.created_at)) / 3600.0)
      END DESC
    LIMIT p_limit
    OFFSET p_offset
  ) q;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- 6. Get my submissions
CREATE OR REPLACE FUNCTION get_my_submissions()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(q) INTO v_result
  FROM (
    SELECT id, option_a, option_b, category, status, upvotes, downvotes, created_at
    FROM community_questions
    WHERE author_id = auth.uid()
    ORDER BY created_at DESC
  ) q;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
