-- 028_personality_v2.sql
-- Content-based personality signals, server-side scoring, dating sub-profile

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS personality_signals jsonb,
  ADD COLUMN IF NOT EXISTS personality_signals_version int DEFAULT 0;

ALTER TABLE user_personality
  ADD COLUMN IF NOT EXISTS model_version int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS content_axes jsonb,
  ADD COLUMN IF NOT EXISTS dating_profile jsonb,
  ADD COLUMN IF NOT EXISTS axis_confidence jsonb;

-- ---------------------------------------------------------------------------
-- Apply personality signals batch (service role)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION apply_personality_signals_batch(p_updates jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec jsonb;
  v_updated int := 0;
BEGIN
  IF p_updates IS NULL OR jsonb_typeof(p_updates) <> 'array' OR jsonb_array_length(p_updates) = 0 THEN
    RAISE EXCEPTION 'p_updates must be a non-empty JSON array';
  END IF;

  FOR rec IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    UPDATE questions
    SET
      personality_signals = rec->'personality_signals',
      personality_signals_version = COALESCE((rec->>'personality_signals_version')::int, 1)
    WHERE id = (rec->>'id')::uuid
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Active question not found: %', rec->>'id';
    END IF;

    v_updated := v_updated + 1;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'updated', v_updated);
END;
$$;

REVOKE ALL ON FUNCTION apply_personality_signals_batch(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION apply_personality_signals_batch(jsonb) TO service_role;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION personality_clamp100(p_val real)
RETURNS int
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT GREATEST(0, LEAST(100, ROUND(p_val)::int));
$$;

CREATE OR REPLACE FUNCTION personality_behavioral_axes(
  p_total_votes int,
  p_majority_count int,
  p_avg_vote_time real,
  p_unique_categories int,
  p_minority_in_skewed int,
  p_skewed_questions int
)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_conformity int;
  v_speed int;
  v_diversity int;
  v_courage int;
  v_clamped_time real;
BEGIN
  IF p_total_votes > 0 THEN
    v_conformity := personality_clamp100((p_majority_count::real / p_total_votes) * 100);
  ELSE
    v_conformity := 50;
  END IF;

  v_clamped_time := GREATEST(0, LEAST(10, COALESCE(p_avg_vote_time, 5)));
  v_speed := personality_clamp100((1 - v_clamped_time / 10) * 100);
  v_diversity := personality_clamp100(LEAST(100, (p_unique_categories::real / 11) * 100));

  IF p_skewed_questions > 0 THEN
    v_courage := personality_clamp100((p_minority_in_skewed::real / p_skewed_questions) * 100);
  ELSE
    v_courage := 50;
  END IF;

  RETURN jsonb_build_object(
    'conformity', v_conformity,
    'speed', v_speed,
    'diversity', v_diversity,
    'courage', v_courage
  );
END;
$$;

CREATE OR REPLACE FUNCTION personality_jsonb_add_num(p_obj jsonb, p_key text, p_delta real)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_current real;
BEGIN
  v_current := COALESCE((p_obj->>p_key)::real, 0);
  RETURN jsonb_set(
    COALESCE(p_obj, '{}'::jsonb),
    ARRAY[p_key],
    to_jsonb(v_current + p_delta),
    true
  );
END;
$$;

CREATE OR REPLACE FUNCTION personality_resolve_weight(
  p_key text,
  p_behavioral jsonb,
  p_content jsonb
)
RETURNS real
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_base text;
BEGIN
  IF right(p_key, 4) = '_inv' THEN
    v_base := left(p_key, length(p_key) - 4);
    IF p_behavioral ? v_base THEN
      RETURN 100 - (p_behavioral->>v_base)::real;
    END IF;
    IF p_content ? v_base THEN
      RETURN 100 - (p_content->>v_base)::real;
    END IF;
    RETURN 50;
  END IF;

  IF p_behavioral ? p_key THEN
    RETURN (p_behavioral->>p_key)::real;
  END IF;
  IF p_content ? p_key THEN
    RETURN (p_content->>p_key)::real;
  END IF;
  RETURN 50;
END;
$$;

CREATE OR REPLACE FUNCTION personality_determine_type_v2(
  p_behavioral jsonb,
  p_content jsonb
)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_type jsonb;
  v_weights jsonb;
  v_key text;
  v_weight real;
  v_score real;
  v_best_score real := -999999;
  v_best_type text := 'flash_rebel';
BEGIN
  v_weights := '[
    {"id":"flash_rebel","weights":{"speed":0.15,"conformity_inv":0.1,"courage":0.1,"risk_tolerance":0.15,"novelty_seeking":0.15,"independence":0.1,"chaos_tolerance":0.15,"practicality_inv":0.1}},
    {"id":"cool_strategist","weights":{"speed_inv":0.15,"conformity":0.15,"courage_inv":0.1,"practicality":0.2,"communication_directness":0.1,"conflict_style_inv":0.1,"chaos_tolerance_inv":0.1,"emotionality_inv":0.1}},
    {"id":"gut_feeler","weights":{"speed":0.15,"conformity":0.15,"diversity_inv":0.1,"emotionality":0.2,"romance_style":0.15,"social_energy":0.1,"practicality_inv":0.05,"risk_tolerance_inv":0.1}},
    {"id":"lone_wolf","weights":{"speed_inv":0.12,"conformity_inv":0.12,"courage":0.15,"independence":0.2,"social_energy_inv":0.15,"commitment_readiness_inv":0.1,"practicality":0.08,"communication_directness_inv":0.08}},
    {"id":"explorer_soul","weights":{"diversity":0.15,"courage":0.12,"conformity_inv":0.1,"novelty_seeking":0.2,"risk_tolerance":0.15,"social_energy":0.1,"independence":0.08,"chaos_tolerance":0.1}},
    {"id":"specialist_sage","weights":{"diversity_inv":0.15,"courage_inv":0.12,"conformity":0.15,"practicality":0.2,"chaos_tolerance_inv":0.12,"novelty_seeking_inv":0.1,"communication_directness":0.08,"commitment_readiness":0.08}},
    {"id":"chaos_agent","weights":{"speed":0.12,"courage":0.12,"diversity":0.12,"conformity_inv":0.08,"chaos_tolerance":0.18,"novelty_seeking":0.15,"risk_tolerance":0.12,"independence":0.11}},
    {"id":"wise_owl","weights":{"speed_inv":0.12,"conformity":0.12,"diversity_inv":0.1,"courage_inv":0.1,"practicality":0.18,"chaos_tolerance_inv":0.15,"emotionality":0.08,"commitment_readiness":0.15}}
  ]'::jsonb;

  FOR v_type IN SELECT * FROM jsonb_array_elements(v_weights)
  LOOP
    v_score := 0;
    FOR v_key, v_weight IN SELECT * FROM jsonb_each_text(v_type->'weights')
    LOOP
      v_score := v_score + personality_resolve_weight(v_key, p_behavioral, p_content) * v_weight::real;
    END LOOP;
    IF v_score > v_best_score THEN
      v_best_score := v_score;
      v_best_type := v_type->>'id';
    END IF;
  END LOOP;

  RETURN v_best_type;
END;
$$;

CREATE OR REPLACE FUNCTION personality_pick_top_enum(p_scores jsonb, p_fallback text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_key text;
  v_val real;
  v_best_key text := p_fallback;
  v_best_val real := -999999;
BEGIN
  IF p_scores IS NULL OR p_scores = '{}'::jsonb THEN
    RETURN p_fallback;
  END IF;
  FOR v_key, v_val IN SELECT key, value::text::real FROM jsonb_each(p_scores)
  LOOP
    IF v_val > v_best_val THEN
      v_best_val := v_val;
      v_best_key := v_key;
    END IF;
  END LOOP;
  RETURN v_best_key;
END;
$$;

-- ---------------------------------------------------------------------------
-- Core compute + save
-- ---------------------------------------------------------------------------

-- Unlock thresholds (keep in sync with lib/personality-constants.ts)
-- PERSONALITY_UNLOCK_VOTES = 6, CONTENT_AXES_UNLOCK_VOTES = 8

CREATE OR REPLACE FUNCTION refresh_personality_v2()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_total_votes int;
  v_majority_count int;
  v_avg_vote_time real;
  v_unique_categories int;
  v_minority_in_skewed int;
  v_skewed_questions int;
  v_behavioral jsonb;
  v_content_raw jsonb := '{}'::jsonb;
  v_content_max jsonb := '{}'::jsonb;
  v_content_coverage jsonb := '{}'::jsonb;
  v_content_axes jsonb := '{}'::jsonb;
  v_content_conf jsonb := '{}'::jsonb;
  v_axis_key text;
  v_raw real;
  v_max real;
  v_cov int;
  v_norm real;
  v_conf real;
  v_display int;
  v_rec record;
  v_choice_signals jsonb;
  v_max_a jsonb;
  v_max_b jsonb;
  v_sig_key text;
  v_sig_val real;
  v_dating_votes int := 0;
  v_dating_enum jsonb := '{}'::jsonb;
  v_dating_pace_raw real := 0;
  v_dating_pace_max real := 0;
  v_together_raw real := 0;
  v_together_max real := 0;
  v_dating_dim text;
  v_dating_val text;
  v_dating_block jsonb;
  v_dating_profile jsonb;
  v_dating_conf real;
  v_personality_type text;
  v_axis_confidence jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT COUNT(*) INTO v_total_votes FROM votes WHERE user_id = v_user_id;
  IF v_total_votes < 6 THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_enough_votes', 'total_votes', v_total_votes);
  END IF;

  -- Behavioral metrics (same as v1)
  SELECT COUNT(*) INTO v_majority_count
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice
    FROM votes GROUP BY question_id
  ) m ON m.question_id = v.question_id AND m.majority_choice = v.choice
  WHERE v.user_id = v_user_id;

  SELECT COALESCE(AVG(vote_time_seconds), 5.0) INTO v_avg_vote_time
  FROM votes WHERE user_id = v_user_id AND vote_time_seconds IS NOT NULL;

  SELECT COUNT(DISTINCT q.category) INTO v_unique_categories
  FROM votes v JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id;

  SELECT
    COUNT(*) FILTER (WHERE v.choice != sq.majority_choice),
    COUNT(*)
  INTO v_minority_in_skewed, v_skewed_questions
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice,
      GREATEST(
        COUNT(*) FILTER (WHERE choice = 'a'),
        COUNT(*) FILTER (WHERE choice = 'b')
      )::REAL / NULLIF(COUNT(*), 0) AS majority_pct
    FROM votes GROUP BY question_id
    HAVING GREATEST(
      COUNT(*) FILTER (WHERE choice = 'a'),
      COUNT(*) FILTER (WHERE choice = 'b')
    )::REAL / NULLIF(COUNT(*), 0) >= 0.65
  ) sq ON sq.question_id = v.question_id
  WHERE v.user_id = v_user_id;

  v_behavioral := personality_behavioral_axes(
    v_total_votes, v_majority_count, v_avg_vote_time, v_unique_categories,
    COALESCE(v_minority_in_skewed, 0), COALESCE(v_skewed_questions, 0)
  );

  -- Aggregate content signals
  FOR v_rec IN
    SELECT v.choice, q.category, q.personality_signals AS sig
    FROM votes v
    JOIN questions q ON q.id = v.question_id
    WHERE v.user_id = v_user_id AND q.personality_signals IS NOT NULL
  LOOP
    v_choice_signals := v_rec.sig->v_rec.choice;
    IF v_choice_signals IS NOT NULL THEN
      FOR v_sig_key, v_sig_val IN SELECT key, value::text::real FROM jsonb_each(v_choice_signals)
      LOOP
        v_content_raw := personality_jsonb_add_num(v_content_raw, v_sig_key, v_sig_val);
      END LOOP;
    END IF;

    v_max_a := COALESCE(v_rec.sig->'a', '{}'::jsonb);
    v_max_b := COALESCE(v_rec.sig->'b', '{}'::jsonb);
    FOR v_sig_key IN SELECT DISTINCT key FROM (
      SELECT key FROM jsonb_each(v_max_a)
      UNION
      SELECT key FROM jsonb_each(v_max_b)
    ) s
    LOOP
      v_sig_val := GREATEST(
        ABS(COALESCE((v_max_a->>v_sig_key)::real, 0)),
        ABS(COALESCE((v_max_b->>v_sig_key)::real, 0))
      );
      v_content_max := personality_jsonb_add_num(v_content_max, v_sig_key, v_sig_val);
      IF v_sig_val > 0 THEN
        v_content_coverage := personality_jsonb_add_num(v_content_coverage, v_sig_key, 1);
      END IF;
    END LOOP;

    IF v_rec.category = 'dating' AND v_rec.sig ? 'dating' THEN
      v_dating_votes := v_dating_votes + 1;
      v_dating_block := v_rec.sig->'dating'->v_rec.choice;
      IF v_dating_block IS NOT NULL THEN
        FOR v_dating_dim, v_dating_val IN SELECT key, value#>>'{}' FROM jsonb_each(v_dating_block)
        LOOP
          IF v_dating_dim IN ('dating_pace', 'togetherness') THEN
            IF v_dating_dim = 'dating_pace' THEN
              v_dating_pace_raw := v_dating_pace_raw + v_dating_val::real;
              v_dating_pace_max := v_dating_pace_max + 2;
            ELSE
              v_together_raw := v_together_raw + v_dating_val::real;
              v_together_max := v_together_max + 2;
            END IF;
          ELSE
            v_dating_enum := jsonb_set(
              COALESCE(v_dating_enum, '{}'::jsonb),
              ARRAY[v_dating_dim, v_dating_val],
              to_jsonb(COALESCE((v_dating_enum#>>ARRAY[v_dating_dim, v_dating_val])::int, 0) + 1),
              true
            );
          END IF;
        END LOOP;
      END IF;
      v_sig_val := GREATEST(
        ABS(COALESCE((v_max_a->>'independence')::real, 0)),
        ABS(COALESCE((v_max_b->>'independence')::real, 0))
      );
      v_together_max := v_together_max + v_sig_val;
      IF v_rec.choice = 'a' THEN
        v_together_raw := v_together_raw - COALESCE((v_max_a->>'independence')::real, 0);
      ELSE
        v_together_raw := v_together_raw - COALESCE((v_max_b->>'independence')::real, 0);
      END IF;
    END IF;
  END LOOP;

  -- Normalize content axes
  FOR v_axis_key IN SELECT unnest(ARRAY[
    'risk_tolerance','novelty_seeking','social_energy','independence','emotionality',
    'practicality','commitment_readiness','communication_directness','conflict_style',
    'romance_style','chaos_tolerance'
  ])
  LOOP
    v_raw := COALESCE((v_content_raw->>v_axis_key)::real, 0);
    v_max := GREATEST(COALESCE((v_content_max->>v_axis_key)::real, 0), 1);
    v_cov := COALESCE((v_content_coverage->>v_axis_key)::int, 0);
    v_norm := 50 + 50 * (v_raw / v_max);
    v_conf := LEAST(1, v_cov::real / 4);
    v_display := personality_clamp100(50 + (v_norm - 50) * v_conf);
    v_content_axes := jsonb_set(v_content_axes, ARRAY[v_axis_key], to_jsonb(v_display), true);
    v_content_conf := jsonb_set(v_content_conf, ARRAY[v_axis_key], to_jsonb(v_conf), true);
  END LOOP;

  v_personality_type := personality_determine_type_v2(v_behavioral, v_content_axes);

  v_dating_conf := LEAST(1, v_dating_votes::real / 8);
  IF v_dating_votes > 0 THEN
    v_dating_profile := jsonb_build_object(
      'attachment_style', personality_pick_top_enum(v_dating_enum->'attachment_style', 'mixed'),
      'dating_pace', personality_clamp100(50 + ((CASE WHEN v_dating_pace_max > 0 THEN 50 + 50 * (v_dating_pace_raw / v_dating_pace_max) ELSE 50 END) - 50) * v_dating_conf),
      'communication_style', personality_pick_top_enum(v_dating_enum->'communication_style', 'balanced'),
      'conflict_style', personality_pick_top_enum(v_dating_enum->'conflict_style', 'harmonizer'),
      'romance_style', personality_pick_top_enum(v_dating_enum->'romance_style', 'steady'),
      'privacy_style', personality_pick_top_enum(v_dating_enum->'privacy_style', 'balanced'),
      'togetherness', personality_clamp100(50 + ((CASE WHEN v_together_max > 0 THEN 50 + 50 * (v_together_raw / v_together_max) ELSE 50 END) - 50) * v_dating_conf),
      'confidence', v_dating_conf,
      'unlocked', v_dating_votes >= 5 AND v_dating_conf >= 0.5,
      'votes_count', v_dating_votes
    );
  ELSE
    v_dating_profile := NULL;
  END IF;

  v_axis_confidence := jsonb_build_object(
    'behavioral', jsonb_build_object(
      'conformity', 1, 'speed', 1, 'diversity', 1, 'courage', 1
    ),
    'content', v_content_conf
  );

  INSERT INTO user_personality (
    user_id, personality_type,
    conformity_score, speed_score, diversity_score, courage_score,
    votes_analyzed, model_version, content_axes, dating_profile, axis_confidence,
    updated_at
  )
  VALUES (
    v_user_id, v_personality_type,
    (v_behavioral->>'conformity')::real,
    (v_behavioral->>'speed')::real,
    (v_behavioral->>'diversity')::real,
    (v_behavioral->>'courage')::real,
    v_total_votes, 2,
    v_content_axes, v_dating_profile, v_axis_confidence,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    personality_type = EXCLUDED.personality_type,
    conformity_score = EXCLUDED.conformity_score,
    speed_score = EXCLUDED.speed_score,
    diversity_score = EXCLUDED.diversity_score,
    courage_score = EXCLUDED.courage_score,
    votes_analyzed = EXCLUDED.votes_analyzed,
    model_version = EXCLUDED.model_version,
    content_axes = EXCLUDED.content_axes,
    dating_profile = EXCLUDED.dating_profile,
    axis_confidence = EXCLUDED.axis_confidence,
    updated_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'model_version', 2,
    'current_type', v_personality_type,
    'personality_type', v_personality_type,
    'needs_refresh', false,
    'majority_count', v_majority_count,
    'avg_vote_time', v_avg_vote_time,
    'unique_categories', v_unique_categories,
    'minority_in_skewed', COALESCE(v_minority_in_skewed, 0),
    'skewed_questions', COALESCE(v_skewed_questions, 0),
    'behavioral_axes', v_behavioral,
    'content_axes', v_content_axes,
    'axis_confidence', v_axis_confidence,
    'dating_profile', v_dating_profile,
    'total_votes', v_total_votes,
    'votes_analyzed', v_total_votes,
    'content_unlocked', v_total_votes >= 8,
    'dating_unlocked', COALESCE((v_dating_profile->>'unlocked')::boolean, false),
    'dating_votes_count', v_dating_votes,
    'v2_available', true
  );
END;
$$;

REVOKE ALL ON FUNCTION refresh_personality_v2() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION refresh_personality_v2() TO authenticated;

DROP FUNCTION IF EXISTS refresh_personality();

-- ---------------------------------------------------------------------------
-- get_personality_context (v1 contract — unchanged for legacy clients)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_personality_context()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_total_votes INT;
  v_majority_count INT;
  v_avg_vote_time REAL;
  v_unique_categories INT;
  v_minority_in_skewed INT;
  v_skewed_questions INT;
  v_personality RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('total_votes', 0);
  END IF;

  SELECT COUNT(*) INTO v_total_votes
  FROM votes WHERE user_id = v_user_id;

  IF v_total_votes = 0 THEN
    RETURN json_build_object('total_votes', 0);
  END IF;

  SELECT COUNT(*) INTO v_majority_count
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice
    FROM votes GROUP BY question_id
  ) m ON m.question_id = v.question_id AND m.majority_choice = v.choice
  WHERE v.user_id = v_user_id;

  SELECT COALESCE(AVG(vote_time_seconds), 5.0) INTO v_avg_vote_time
  FROM votes WHERE user_id = v_user_id AND vote_time_seconds IS NOT NULL;

  SELECT COUNT(DISTINCT q.category) INTO v_unique_categories
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id;

  SELECT
    COUNT(*) FILTER (WHERE v.choice != sq.majority_choice),
    COUNT(*)
  INTO v_minority_in_skewed, v_skewed_questions
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice,
      GREATEST(
        COUNT(*) FILTER (WHERE choice = 'a'),
        COUNT(*) FILTER (WHERE choice = 'b')
      )::REAL / NULLIF(COUNT(*), 0) AS majority_pct
    FROM votes GROUP BY question_id
    HAVING GREATEST(
      COUNT(*) FILTER (WHERE choice = 'a'),
      COUNT(*) FILTER (WHERE choice = 'b')
    )::REAL / NULLIF(COUNT(*), 0) >= 0.65
  ) sq ON sq.question_id = v.question_id
  WHERE v.user_id = v_user_id;

  SELECT personality_type, votes_analyzed
  INTO v_personality
  FROM user_personality WHERE user_id = v_user_id;

  RETURN json_build_object(
    'total_votes', v_total_votes,
    'majority_count', v_majority_count,
    'avg_vote_time', v_avg_vote_time,
    'unique_categories', v_unique_categories,
    'minority_in_skewed', COALESCE(v_minority_in_skewed, 0),
    'skewed_questions', COALESCE(v_skewed_questions, 0),
    'current_type', COALESCE(v_personality.personality_type, 'unknown'),
    'votes_analyzed', COALESCE(v_personality.votes_analyzed, 0)
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- get_personality_context_v2 (v1 fields + v2 extensions)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_personality_context_v2()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_total_votes INT;
  v_majority_count INT;
  v_avg_vote_time REAL;
  v_unique_categories INT;
  v_minority_in_skewed INT;
  v_skewed_questions INT;
  v_personality RECORD;
  v_needs_refresh boolean;
  v_content_unlocked boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('total_votes', 0, 'v2_available', true, 'error', 'not_authenticated');
  END IF;

  SELECT COUNT(*) INTO v_total_votes
  FROM votes WHERE user_id = v_user_id;

  IF v_total_votes = 0 THEN
    RETURN json_build_object('total_votes', 0, 'model_version', 1, 'v2_available', true);
  END IF;

  SELECT COUNT(*) INTO v_majority_count
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice
    FROM votes GROUP BY question_id
  ) m ON m.question_id = v.question_id AND m.majority_choice = v.choice
  WHERE v.user_id = v_user_id;

  SELECT COALESCE(AVG(vote_time_seconds), 5.0) INTO v_avg_vote_time
  FROM votes WHERE user_id = v_user_id AND vote_time_seconds IS NOT NULL;

  SELECT COUNT(DISTINCT q.category) INTO v_unique_categories
  FROM votes v
  JOIN questions q ON q.id = v.question_id
  WHERE v.user_id = v_user_id;

  SELECT
    COUNT(*) FILTER (WHERE v.choice != sq.majority_choice),
    COUNT(*)
  INTO v_minority_in_skewed, v_skewed_questions
  FROM votes v
  JOIN (
    SELECT question_id,
      CASE WHEN COUNT(*) FILTER (WHERE choice = 'a') >= COUNT(*) FILTER (WHERE choice = 'b')
        THEN 'a' ELSE 'b'
      END AS majority_choice,
      GREATEST(
        COUNT(*) FILTER (WHERE choice = 'a'),
        COUNT(*) FILTER (WHERE choice = 'b')
      )::REAL / NULLIF(COUNT(*), 0) AS majority_pct
    FROM votes GROUP BY question_id
    HAVING GREATEST(
      COUNT(*) FILTER (WHERE choice = 'a'),
      COUNT(*) FILTER (WHERE choice = 'b')
    )::REAL / NULLIF(COUNT(*), 0) >= 0.65
  ) sq ON sq.question_id = v.question_id
  WHERE v.user_id = v_user_id;

  v_content_unlocked := v_total_votes >= 8;

  IF v_total_votes < 6 THEN
    RETURN json_build_object(
      'total_votes', v_total_votes,
      'majority_count', v_majority_count,
      'avg_vote_time', v_avg_vote_time,
      'unique_categories', v_unique_categories,
      'minority_in_skewed', COALESCE(v_minority_in_skewed, 0),
      'skewed_questions', COALESCE(v_skewed_questions, 0),
      'model_version', 1,
      'current_type', 'unknown',
      'personality_type', 'unknown',
      'needs_refresh', false,
      'content_unlocked', false,
      'dating_unlocked', false,
      'v2_available', true
    );
  END IF;

  SELECT *
  INTO v_personality
  FROM user_personality WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    v_needs_refresh := true;
  ELSE
    v_needs_refresh := (
      COALESCE(v_personality.model_version, 1) < 2
      OR v_personality.personality_type = 'unknown'
      OR COALESCE(v_personality.votes_analyzed, 0) = 0
      OR v_total_votes > COALESCE(v_personality.votes_analyzed, 0)
    );
  END IF;

  IF v_needs_refresh THEN
    RETURN refresh_personality_v2();
  END IF;

  RETURN json_build_object(
    'total_votes', v_total_votes,
    'majority_count', v_majority_count,
    'avg_vote_time', v_avg_vote_time,
    'unique_categories', v_unique_categories,
    'minority_in_skewed', COALESCE(v_minority_in_skewed, 0),
    'skewed_questions', COALESCE(v_skewed_questions, 0),
    'votes_analyzed', COALESCE(v_personality.votes_analyzed, 0),
    'model_version', COALESCE(v_personality.model_version, 1),
    'current_type', COALESCE(v_personality.personality_type, 'unknown'),
    'personality_type', COALESCE(v_personality.personality_type, 'unknown'),
    'needs_refresh', false,
    'behavioral_axes', json_build_object(
      'conformity', COALESCE(v_personality.conformity_score, 0),
      'speed', COALESCE(v_personality.speed_score, 0),
      'diversity', COALESCE(v_personality.diversity_score, 0),
      'courage', COALESCE(v_personality.courage_score, 0)
    ),
    'content_axes', COALESCE(v_personality.content_axes, '{}'::jsonb),
    'axis_confidence', COALESCE(v_personality.axis_confidence, '{}'::jsonb),
    'dating_profile', v_personality.dating_profile,
    'content_unlocked', v_content_unlocked,
    'dating_unlocked', COALESCE((v_personality.dating_profile->>'unlocked')::boolean, false),
    'dating_votes_count', COALESCE((v_personality.dating_profile->>'votes_count')::int, 0),
    'v2_available', true
  );
END;
$$;

REVOKE ALL ON FUNCTION get_personality_context_v2() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_personality_context_v2() TO authenticated;

-- ---------------------------------------------------------------------------
-- save_personality (v1 contract — client-provided scores)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION save_personality(
  p_type TEXT,
  p_conformity REAL,
  p_speed REAL,
  p_diversity REAL,
  p_courage REAL,
  p_votes_analyzed INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  INSERT INTO user_personality (user_id, personality_type, conformity_score, speed_score, diversity_score, courage_score, votes_analyzed, updated_at)
  VALUES (v_user_id, p_type, p_conformity, p_speed, p_diversity, p_courage, p_votes_analyzed, now())
  ON CONFLICT (user_id) DO UPDATE SET
    personality_type = EXCLUDED.personality_type,
    conformity_score = EXCLUDED.conformity_score,
    speed_score = EXCLUDED.speed_score,
    diversity_score = EXCLUDED.diversity_score,
    courage_score = EXCLUDED.courage_score,
    votes_analyzed = EXCLUDED.votes_analyzed,
    updated_at = now();

  RETURN json_build_object('success', true);
END;
$$;

-- ---------------------------------------------------------------------------
-- Friends with v2 personality
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_friends_with_personality()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
          'courage', ROUND(up.courage_score::numeric),
          'content_axes', up.content_axes,
          'dating_profile', up.dating_profile,
          'model_version', COALESCE(up.model_version, 1)
        )
        ELSE NULL
      END AS axes
    FROM (
      SELECT friend_id FROM friendships WHERE user_id = v_user_id
      UNION
      SELECT user_id AS friend_id FROM friendships WHERE friend_id = v_user_id
    ) f
    JOIN user_profiles p ON p.user_id = f.friend_id
    LEFT JOIN user_personality up ON up.user_id = f.friend_id
    ORDER BY p.display_name NULLS LAST, p.friend_code
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
