-- 029_personality_v2_hotfix.sql
-- P0: personality_clamp100 double precision/numeric overloads; lock apply_personality_signals_batch to service_role

-- ---------------------------------------------------------------------------
-- personality_clamp100 overloads (real/int division yields double precision)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION personality_clamp100(p_val double precision)
RETURNS int
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT GREATEST(0, LEAST(100, ROUND(p_val)::int));
$$;

CREATE OR REPLACE FUNCTION personality_clamp100(p_val numeric)
RETURNS int
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT GREATEST(0, LEAST(100, ROUND(p_val)::int));
$$;

-- ---------------------------------------------------------------------------
-- apply_personality_signals_batch: service_role guard + permission hardening
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
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'service_role required';
  END IF;

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

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT oid::regprocedure AS sig
    FROM pg_proc
    WHERE proname = 'apply_personality_signals_batch'
      AND pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', r.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', r.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
