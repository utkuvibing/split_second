# Personality v2 Deploy Runbook

Deploy Faz 2 in this order. **Do not ship the app before migration and signals are applied.**

## Prerequisites

- [ ] `npm run validate:questions` — PASS
- [ ] `npm run validate:personality-signals` — PASS (22/22 dating `review_status=reviewed`)
- [ ] `npm run validate:personality-weights` — PASS
- [ ] `npm test` and `npm run typecheck` — PASS
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in local `.env` (signals apply only)

## 1. Backup

```bash
npm run backup:supabase
```

Minimum tables to verify in backup:

- `questions`
- `user_personality`
- `votes`

Store backup timestamp — needed for rollback comparison.

## 2. Apply migration 028

Apply `supabase/migrations/028_personality_v2.sql` to the **remote** project (`split-second`).

This adds:

- `questions.personality_signals`, `personality_signals_version`
- `user_personality.model_version`, `content_axes`, `dating_profile`, `axis_confidence`
- `refresh_personality_v2`, `get_personality_context_v2`, `apply_personality_signals_batch`
- **Preserves v1** `get_personality_context` and `save_personality` contracts

Verify:

```sql
SELECT proname FROM pg_proc
WHERE proname IN ('get_personality_context', 'get_personality_context_v2', 'refresh_personality_v2');
```

## 3. Signal apply — dry run

```bash
node scripts/apply-personality-signals.mjs --dry-run
```

Check `data/reports/personality-signals-dry-run-*.json`:

- `rows_to_update`: 214
- `dating_reviewed`: 22

## 4. Signal apply — live (explicit confirm)

```bash
node scripts/apply-personality-signals.mjs --confirm
```

Requires `SUPABASE_SERVICE_ROLE_KEY`. **No anon fallback.**

Verify:

```sql
SELECT count(*) FROM questions WHERE personality_signals IS NOT NULL;
-- expect 214
```

## 5. Smoke test

As an authenticated test user with ≥6 votes:

1. Call `get_personality_context` — must still return `majority_count`, `avg_vote_time`, etc.
2. Call `get_personality_context_v2` — must return v1 fields **plus** `behavioral_axes`, `content_axes`, `v2_available`.
3. Call `refresh_personality_v2` — `model_version=2`, `content_unlocked` when `total_votes >= 8`.
4. Profile UI — no 0% behavioral bars on v1-only DB; content section shows “updating” until v2 + signals ready.

## 6. App release

- **Minimum app version:** build that includes v2 client (`get_personality_context_v2` + fallbacks).
- **Rollout:** DB migration → signals apply → app release (same day).
- Old store builds remain safe: they still use v1 `get_personality_context` + client `save_personality`.

## Rollback

1. **App:** revert to previous build if needed (v1 RPCs unchanged).
2. **DB functions:** restore `get_personality_context` / `save_personality` from `010_personality.sql` if modified outside 028.
3. **Optional:** `UPDATE questions SET personality_signals = NULL` (content scoring stops; behavioral v1 still works).
4. **Data:** compare `user_personality` to pre-deploy backup; re-run v1 client recalc if types shifted.

## Compatibility notes

| Client | DB (pre-028) | DB (post-028) |
|--------|--------------|---------------|
| Old app (v1 RPC) | OK | OK — v1 fields preserved |
| New app (v2 RPC) | OK — v1 fallback, no 0% bars | Full v2 |

## Unlock thresholds (single source)

From `lib/personality-constants.ts`:

- Personality type: **6** votes
- Content axes: **8** votes
- Dating profile: **5** dating-category votes + confidence ≥ 0.5

SQL migration comments reference the same values.

## Monitoring (first 48h)

- RPC errors: `refresh_personality_v2`, `get_personality_context_v2`
- Share of users with `model_version=2`
- Dating profile unlock rate
- Support tickets mentioning wrong 0% personality bars
