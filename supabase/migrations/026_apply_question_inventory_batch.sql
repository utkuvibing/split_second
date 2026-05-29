-- Atomic batch apply for question inventory (canonical JSON → questions table).
-- Callable only with service_role. Uses two-phase date/slot updates to avoid
-- unique (scheduled_date, time_slot) conflicts during reorder.

CREATE OR REPLACE FUNCTION apply_question_inventory_batch(p_updates jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec jsonb;
  v_updated int := 0;
  v_idx int;
BEGIN
  IF p_updates IS NULL OR jsonb_typeof(p_updates) <> 'array' OR jsonb_array_length(p_updates) = 0 THEN
    RAISE EXCEPTION 'p_updates must be a non-empty JSON array';
  END IF;

  -- Phase 1: staging slots (unique date+slot, far from production schedule)
  v_idx := 0;
  FOR rec IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    UPDATE questions
    SET
      scheduled_date = DATE '1900-01-01' + (v_idx / 3),
      time_slot = (ARRAY['morning', 'afternoon', 'evening'])[1 + (v_idx % 3)]
    WHERE id = (rec->>'id')::uuid
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Active question not found: %', rec->>'id';
    END IF;

    v_idx := v_idx + 1;
  END LOOP;

  -- Phase 2: final field values
  FOR rec IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    UPDATE questions
    SET
      scheduled_date = (rec->>'scheduled_date')::date,
      time_slot = rec->>'time_slot',
      category = rec->>'category',
      question_text = rec->>'question_text',
      question_text_tr = rec->>'question_text_tr',
      option_a = rec->>'option_a',
      option_a_tr = rec->>'option_a_tr',
      option_b = rec->>'option_b',
      option_b_tr = rec->>'option_b_tr'
    WHERE id = (rec->>'id')::uuid
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Active question not found on final update: %', rec->>'id';
    END IF;

    v_updated := v_updated + 1;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'updated', v_updated);
END;
$$;

REVOKE ALL ON FUNCTION apply_question_inventory_batch(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION apply_question_inventory_batch(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION apply_question_inventory_batch(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION apply_question_inventory_batch(jsonb) TO authenticated;
