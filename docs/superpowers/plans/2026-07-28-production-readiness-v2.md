# Split Second Production Readiness V2 Implementation Plan

> **For agentic workers:** Execute inline in the primary agent. The repository
> policy forbids subagents unless the user explicitly requests them. Use
> test-driven changes, stop at failed verification until understood, and commit
> each task separately.

**Goal:** Remove confirmed production blockers, reduce backend and UI
complexity, and add the minimum operational foundations required to release the
existing product safely without rewriting it.

**Architecture:** Establish shared authentication, error/logging, purchase,
notification, and data-fetching boundaries first. Move trusted rules and
aggregations into forward-only PostgreSQL migrations with least-privilege RPCs.
Then split the daily-question route around a typed daily-session contract and
add CI, local Supabase, E2E, recovery, analytics, moderation, remote config,
and accurate documentation.

**Tech stack:** Expo SDK 54, React Native 0.81, React 19, Expo Router,
TypeScript 5.9, Supabase Auth/PostgreSQL/PostgREST RPC, Jest, React Native
Testing Library, Maestro, GitHub Actions, EAS Build.

## Global constraints

- Work only on `hardening/production-readiness-v2`; never push to `master`.
- Never commit secrets, `.env`, service-role keys, provider credentials, or
  production data.
- Never rewrite migrations `001` through `029`; add forward-only migrations.
- Never weaken RLS, tests, assertions, Turkish/English localization, or current
  iOS/Android/web support.
- Preserve existing UI and product behavior unless a confirmed defect requires
  a change.
- Add no dependency until its value is documented and Expo SDK 54 compatibility
  is verified.
- Use the smallest sufficient validation after each task and the complete gate
  at P0/P1 completion.
- Keep commits focused and stop when each acceptance criterion is satisfied.

---

## Priority map

### P0: production blockers

1. Reproducible toolchain and Expo patch alignment.
2. Authentication/loading reliability.
3. Trusted-state and RPC emergency hardening.
4. Community-question security and moderation primitives.
5. Friend leaderboard privacy/scalability.
6. Safe premium/purchase abstraction.
7. Local Supabase reset and migration verification.

### P1: architecture and reliability

8. Structured errors, logging, and retry UX.
9. Idempotent notification scheduling.
10. Typed daily-session RPC and N+1 removal.
11. Home feature-boundary refactor and idempotent effects.
12. Data cache/request deduplication decision and implementation.
13. CI, SQL tests, E2E smoke tests, and release gates.

### P2: growth and operations

14. Account linking/recovery design and safe interfaces.
15. Provider-neutral analytics.
16. Moderation operations and remote configuration.
17. Documentation reconciliation and final audit.

## Planned file boundaries

| Boundary | Responsibility |
|---|---|
| `lib/auth/` | Auth result classification and single in-flight initialization |
| `providers/AuthProvider.tsx` | Shared auth lifecycle, retry, and session events |
| `lib/errors/` | Typed normalized application errors |
| `lib/logger/` | Redacted development and production-monitoring adapters |
| `lib/notifications/` | Permission, preferences, persisted Expo IDs, reconciliation |
| `lib/purchases/` | Provider-neutral purchase/restore/entitlement contract |
| `features/daily-questions/` | Daily session, vote orchestration, result screens |
| `features/rewards/` | Idempotent post-vote/day-completion effects |
| `lib/data/` | Shared cache ownership or TanStack Query configuration |
| `supabase/tests/` | SQL assertions for RLS, grants, RPC output, and abuse cases |
| `.maestro/` | Deterministic mobile smoke flows |
| `docs/` | Architecture, testing, database, security, release, operations |

---

## P0 tasks

### Task 1: Align the toolchain and restore a clean Expo baseline

**Files:**

- Create: `.nvmrc`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.npmrc`
- Modify: `eas.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/secret-guard.yml`
- Create: `docs/release/branch-protection.md`

**Produces:**

```json
{
  "engines": {
    "node": ">=20.19.4 <21",
    "npm": ">=10 <11"
  }
}
```

Pin `.nvmrc` to `20.19.4` and use the same Node major in CI and EAS.

- [ ] Remove repository-wide `legacy-peer-deps=true`; first run
  `npm ci --legacy-peer-deps=false` and record the exact outcome.
- [ ] Use `npx expo install` to align only the five Doctor-reported SDK 54 patch
  packages; do not upgrade Expo SDK major.
- [ ] Run `npm ci`, `npm run typecheck`, `npm test -- --runInBand`, and
  `npx expo-doctor`.
- [ ] If npm audit findings remain, classify reachable runtime risk without
  using `npm audit fix --force`.
- [ ] Update CI to use `npm ci`, cache the lockfile, target `master`, retain
  concurrency cancellation, and keep EAS conditional.
- [ ] Commit:

```bash
git add .nvmrc package.json package-lock.json .npmrc eas.json .github/workflows docs/release/branch-protection.md
git commit -m "build: make Expo toolchain reproducible"
```

**Acceptance:** Strict install succeeds, all Node consumers use Node 20,
Expo Doctor passes, and no legacy-peer exception remains without a documented
specific package conflict.

### Task 2: Make authentication explicit, shared, retryable, and finite

**Files:**

- Create: `lib/errors/AppError.ts`
- Create: `lib/errors/errorCodes.ts`
- Create: `lib/errors/normalizeError.ts`
- Create: `lib/logger/types.ts`
- Create: `lib/logger/index.ts`
- Create: `lib/auth/types.ts`
- Create: `lib/auth/client.ts`
- Create: `lib/auth/index.ts`
- Create: `providers/AuthProvider.tsx`
- Create: `components/AuthErrorScreen.tsx`
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/leaderboard.tsx`
- Modify: `app/(tabs)/profile.tsx`
- Modify: `app/q/[date].tsx`
- Modify: `hooks/useTodayQuestions.ts`
- Delete after consumers migrate: `hooks/useAuth.ts`
- Delete after consumers migrate: `lib/auth.ts`
- Test: `lib/auth/__tests__/client.test.ts`
- Test: `providers/__tests__/AuthProvider.test.tsx`
- Test: `hooks/__tests__/useTodayQuestions.test.ts`

**Interfaces:**

```ts
export type AuthErrorCode =
  | 'AUTH_NETWORK'
  | 'AUTH_SESSION_RESTORE'
  | 'AUTH_ANONYMOUS_DISABLED'
  | 'AUTH_CONFIGURATION'
  | 'AUTH_UNKNOWN';

export type AuthState =
  | { status: 'loading'; userId: null; error: null }
  | { status: 'authenticated'; userId: string; error: null }
  | { status: 'error'; userId: null; error: AppError };

export interface AuthContextValue extends AuthState {
  retry(): Promise<void>;
}
```

`initializeAuth()` must inspect `getSession()` errors, restore an existing
session, deduplicate one anonymous login promise, and throw a normalized
`AppError` instead of returning ambiguous `null`.

- [ ] Write failing tests for existing session, new anonymous session,
  restoration error, anonymous-disabled error, missing Supabase config,
  duplicate callers, retry, and unmount.
- [ ] Run the focused tests and verify the old implementation fails the error,
  retry, deduplication, and finite-loading assertions.
- [ ] Implement the auth client and provider; subscribe to auth changes and
  clean up the subscription.
- [ ] Change `useTodayQuestions` to accept auth status or return
  `loading: false` immediately whenever authentication is not active.
- [ ] Render `AuthErrorScreen` with localized safe copy and retry; never render
  raw Supabase messages.
- [ ] Run focused auth/home tests, lint, and typecheck.
- [ ] Commit:

```bash
git add app components/AuthErrorScreen.tsx hooks lib/auth lib/errors lib/logger providers
git commit -m "fix: prevent infinite loading after auth failure"
```

**Acceptance:** Every auth branch reaches authenticated or error, retry works,
one anonymous attempt is in flight at a time, sessions are preserved, and no
state update occurs after unmount.

### Task 3: Lock trusted state and privileged RPC execution

**Files:**

- Create: `supabase/migrations/030_trusted_state_security_hardening.sql`
- Create: `supabase/tests/030_trusted_state_security_hardening.test.sql`
- Modify: client callers only where hardened signatures change:
  `hooks/useCoins.ts`, `hooks/useCosmetics.ts`, `lib/avatar.ts`,
  `lib/nickname.ts`, `lib/friendRequests.ts`, `lib/badges.ts`,
  `lib/mysteryBox.ts`
- Create: `docs/security/security-review-v2.md` with initial resolved findings

**Migration rules:**

```sql
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_profiles FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.coin_transactions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_streaks FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_badges FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_cosmetics FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_mystery_boxes FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_boosts FROM anon, authenticated;
```

Redefine active user-context functions with:

```sql
SECURITY DEFINER
SET search_path = pg_catalog, public
```

and begin with:

```sql
v_user_id := auth.uid();
IF v_user_id IS NULL THEN
  RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
END IF;
```

- [ ] Inventory final active signatures through `pg_proc`, not only migration
  text, and encode expected grants in the SQL test.
- [ ] Write failing SQL tests proving clients can currently mutate trusted
  columns, call `dev_add_coins`, replay badge rewards, pass zero/negative
  prices, bypass rename cost, and forge friendship rows.
- [ ] Add server-owned item and action pricing tables or immutable SQL lookup
  functions; do not accept prices or premium flags from clients.
- [ ] Revoke `dev_add_coins`, legacy free `purchase_cosmetic`, direct badge
  insertion/unlock, and unsafe execution from production roles.
- [ ] Bind badge and mystery-box rewards to durable, unique server events.
- [ ] Make friendship/request writes RPC-only.
- [ ] Run `supabase db reset`, SQL tests, client focused tests, lint, and
  typecheck.
- [ ] Commit:

```bash
git add supabase/migrations/030_trusted_state_security_hardening.sql supabase/tests hooks lib docs/security
git commit -m "security: protect trusted economy and social state"
```

**Acceptance:** Authenticated clients cannot directly forge trusted state;
development RPCs are not executable; prices, premium checks, and rewards are
server-owned; every privileged user RPC rejects null auth and has fixed
`search_path` and explicit grants.

### Task 4: Harden community questions and moderation primitives

**Files:**

- Create: `supabase/migrations/031_community_security_hardening.sql`
- Create: `supabase/tests/031_community_security_hardening.test.sql`
- Modify: `lib/communityQuestions.ts`
- Modify: `hooks/useCommunityQuestions.ts`
- Modify: `hooks/useSubmitQuestion.ts`
- Modify: `app/(tabs)/community.tsx`
- Modify: `components/CommunityQuestionCard.tsx`
- Modify: `components/SubmitQuestionModal.tsx`
- Test: `lib/__tests__/communityQuestions.test.ts`
- Test: `hooks/__tests__/useCommunityQuestions.test.ts`
- Test: `hooks/__tests__/useSubmitQuestion.test.ts`

**Safe feed interface:**

```ts
export interface CommunityFeedItem {
  id: string;
  optionA: string;
  optionB: string;
  category: CommunityCategory;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  authorDisplayName: string | null;
  userVote: 'up' | 'down' | null;
  userReported: boolean;
}
```

The ordinary feed must omit `author_id`, friend code, moderation status,
report count, internal audit fields, and rejected/quarantined content.

- [ ] Write SQL failures for unauthenticated calls, direct table reads,
  rejected visibility, UUID leakage, invalid sort/category, negative/oversized
  pagination, identical options, insufficient coins, daily limit, self-vote,
  report abuse, and failed-submission balance preservation.
- [ ] Drop broad raw select/insert policies and make table mutations RPC-only.
- [ ] Clamp limit to 1..50 and offset to a safe maximum; validate sort against
  `hot/new/top` and category against the server catalog.
- [ ] Normalize whitespace/case, reject empty, identical, and reasonable
  near-identical pairs before locking/deducting coins.
- [ ] Separate reaction uniqueness from report uniqueness so reporting cannot
  be undone by an up/down vote.
- [ ] Add `quarantined` state, moderation timestamps, reason codes, a moderator
  role table, and append-only moderator audit records.
- [ ] Grant ordinary feed/submission/vote/report RPCs only to `authenticated`;
  grant moderator actions only after a server-verified role check.
- [ ] Add indexes supporting status/time feed queries, author daily count,
  reactions, reports, and moderation queue.
- [ ] Update client runtime guards and user-safe errors.
- [ ] Run reset, SQL tests, Jest tests, lint, and typecheck.
- [ ] Commit:

```bash
git add supabase/migrations/031_community_security_hardening.sql supabase/tests lib/communityQuestions.ts hooks app components
git commit -m "security: harden community question access"
```

**Acceptance:** Raw community rows are unavailable to ordinary clients;
feed output is privacy-safe; atomic charging and daily limits are verified;
moderation/report behavior cannot be bypassed through direct table writes.

### Task 5: Move friend leaderboard ranking to PostgreSQL

**Files:**

- Create: `supabase/migrations/032_friend_leaderboard.sql`
- Create: `supabase/tests/032_friend_leaderboard.test.sql`
- Modify: `lib/leaderboard.ts`
- Modify: `hooks/useLeaderboard.ts`
- Test: `lib/__tests__/leaderboard.test.ts`
- Test: `hooks/__tests__/useLeaderboard.test.ts`

**RPC signature:**

```sql
get_friend_leaderboard(p_limit integer DEFAULT 50) RETURNS jsonb
```

Return public display fields only. If the current UI requires a stable
highlight key, return `is_current_user boolean` instead of exposing raw UUIDs.

- [ ] Seed current user, confirmed friend, pending request, removed friend,
  non-friend, and a friend outside global top 1,000 in SQL tests.
- [ ] Rank only the current user and confirmed friendship edges with a clamped
  1..100 limit.
- [ ] Add/verify friendship and streak ranking indexes.
- [ ] Replace `fetchLeaderboard(1000) + getFriendsList()` with one RPC.
- [ ] Run SQL/Jest tests and verify the UI shape remains unchanged.
- [ ] Commit:

```bash
git add supabase/migrations/032_friend_leaderboard.sql supabase/tests lib/leaderboard.ts hooks/useLeaderboard.ts lib/__tests__ hooks/__tests__
git commit -m "perf: rank friend leaderboard in PostgreSQL"
```

**Acceptance:** Current user and confirmed friends rank correctly, pending and
non-friends are excluded, unauthorized calls fail, and client download is
bounded to the requested result set.

### Task 6: Replace the fake paywall with a safe purchase boundary

**Files:**

- Create: `lib/purchases/types.ts`
- Create: `lib/purchases/config.ts`
- Create: `lib/purchases/client.ts`
- Create: `lib/purchases/entitlements.ts`
- Create: `lib/purchases/index.ts`
- Modify: `lib/premium.ts`
- Modify: `hooks/usePremium.ts`
- Modify: `components/Paywall.tsx`
- Modify: `components/DevMenu.tsx`
- Modify: `lib/i18n.ts`
- Test: `lib/purchases/__tests__/client.test.ts`
- Test: `hooks/__tests__/usePremium.test.ts`
- Test: `components/__tests__/Paywall.test.tsx`
- Create: `docs/release/purchases.md`

**Interfaces:**

```ts
export type PurchaseResult =
  | { status: 'purchased'; entitlement: VerifiedEntitlement }
  | { status: 'cancelled' }
  | { status: 'pending' }
  | { status: 'unavailable'; reason: 'not_configured' | 'offline' }
  | { status: 'failed'; error: AppError };

export interface PurchaseClient {
  getEntitlement(): Promise<VerifiedEntitlement | null>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
}
```

- [ ] Write failing tests for dev simulation, production simulation rejection,
  cancellation, pending, failure, restore failure/success, verified and expired
  entitlements, offline, and loading states.
- [ ] Guard every dev setter with `__DEV__`; throw or no-op safely in
  production.
- [ ] Provide an unconfigured production adapter that visibly disables purchase
  and restore without granting entitlement or pretending success.
- [ ] Keep product IDs in validated public configuration; add no credentials.
- [ ] Make purchase and restore distinct handlers and localized states.
- [ ] Ensure server premium fields remain client read-only after Task 3.
- [ ] Document exact external provider/store/webhook configuration still
  required.
- [ ] Commit:

```bash
git add lib/purchases lib/premium.ts hooks/usePremium.ts components/Paywall.tsx components/DevMenu.tsx lib/i18n.ts docs/release/purchases.md
git commit -m "fix: disable unverified production premium purchases"
```

**Acceptance:** No production action can enable premium locally; dev
simulation works only in dev; purchase/restore states are honest and tested.

### Task 7: Establish and verify local Supabase development

**Files:**

- Create: `supabase/config.toml`
- Consolidate deterministic local seed entry: `supabase/seed.sql`
- Create: `scripts/verify-migrations.mjs`
- Modify: `package.json`
- Create: `docs/database/local-development.md`
- Create: `docs/database/migrations.md`
- Create: `docs/database/rpc-reference.md`

**Scripts:**

```json
{
  "db:start": "supabase start",
  "db:reset": "supabase db reset",
  "db:test": "supabase test db",
  "db:verify": "node scripts/verify-migrations.mjs"
}
```

- [ ] Install/use Supabase CLI through a pinned project mechanism or documented
  `npx` version; do not add global-machine assumptions.
- [ ] Configure local ports, auth anonymous sign-in, deterministic seed, and
  redirect URLs without credentials.
- [ ] Reset from empty and run migrations `001` through current in order.
- [ ] Detect duplicate/superseded active RPC definitions through `pg_proc`.
- [ ] Run all SQL tests from Tasks 3–5.
- [ ] Document local/staging/production separation, deployment order, backup,
  forward-fix rollback, and secrets handling.
- [ ] Commit:

```bash
git add supabase/config.toml supabase/seed.sql scripts/verify-migrations.mjs package.json docs/database
git commit -m "build: add reproducible Supabase local workflow"
```

**Acceptance:** `supabase db reset`, migration verification, and SQL tests pass
on an empty local database; no credentials are committed.

---

## P1 tasks

### Task 8: Standardize errors, logging, monitoring boundaries, and retry UX

**Files:**

- Expand: `lib/errors/AppError.ts`, `lib/errors/errorCodes.ts`,
  `lib/errors/normalizeError.ts`
- Expand: `lib/logger/index.ts`, `lib/logger/types.ts`
- Create: `lib/logger/redact.ts`
- Create: `lib/logger/monitoringAdapter.ts`
- Modify affected services/hooks in `lib/`, `hooks/`, and routes/components
- Test: `lib/errors/__tests__/normalizeError.test.ts`
- Test: `lib/logger/__tests__/redact.test.ts`

**Core model:**

```ts
export type AppErrorCategory =
  | 'authentication'
  | 'network'
  | 'validation'
  | 'permission'
  | 'database'
  | 'duplicate_action'
  | 'rate_limit'
  | 'purchase'
  | 'unknown';

export interface AppErrorMetadata {
  feature: string;
  operation: string;
  recoverable: boolean;
  messageKey: TranslationKey;
}
```

- [ ] Prove redaction removes access tokens, UUIDs, friend codes, and
  user-generated text.
- [ ] Replace ambiguous empty/null fallbacks where callers need to distinguish
  failure from valid empty data.
- [ ] Add user-visible retry for vote, friend actions, community submit,
  purchase, and refresh; background rewards log without blocking voting.
- [ ] Deduplicate repeated toast/error presentation.
- [ ] Keep development console logging and a no-credential production adapter.
- [ ] Commit:

```bash
git add lib/errors lib/logger lib hooks app components
git commit -m "feat: add structured errors and safe logging"
```

### Task 9: Make notification scheduling idempotent

**Files:**

- Replace: `lib/notifications.ts`
- Create: `lib/notifications/types.ts`
- Create: `lib/notifications/permissions.ts`
- Create: `lib/notifications/storage.ts`
- Create: `lib/notifications/scheduler.ts`
- Create: `lib/notifications/index.ts`
- Create: `lib/notifications/__tests__/scheduler.test.ts`
- Modify: `app/_layout.tsx` or settings/onboarding integration
- Modify: `features/rewards/` post-vote caller

**Stored record:**

```ts
export interface ScheduledReminderRecord {
  category:
    | 'morning_question'
    | 'afternoon_question'
    | 'evening_question'
    | 'streak_warning'
    | 'live_event';
  notificationId: string;
  timezone: string;
  locale: string;
  scheduleFingerprint: string;
}
```

- [ ] Test identical reconciliation, replacing one reminder, duplicate streak
  prevention, web/simulator, denied permission, timezone/locale change, and
  preservation of unrelated notifications.
- [ ] Store actual Expo notification IDs and cancel only the affected ID.
- [ ] Move permission prompts to an explicit preference/onboarding action.
- [ ] Schedule a streak warning only for an eligible incomplete day and cancel
  it after completion.
- [ ] Catch/log all scheduling failures so voting never fails.
- [ ] Commit:

```bash
git add lib/notifications app features lib/i18n.ts
git commit -m "refactor: make notification scheduling idempotent"
```

### Task 10: Replace daily restoration N+1 with a typed session RPC

**Files:**

- Create: `supabase/migrations/033_daily_question_session.sql`
- Create: `supabase/tests/033_daily_question_session.test.sql`
- Create: `features/daily-questions/types.ts`
- Create: `features/daily-questions/services/dailyQuestionService.ts`
- Create: `features/daily-questions/hooks/useDailyQuestionSession.ts`
- Test: corresponding service/hook tests
- Modify: `app/(tabs)/index.tsx`
- Retire after migration: `hooks/useTodayQuestions.ts`, restoration parts of
  `lib/votes.ts`

**Response model:**

```ts
export interface DailyQuestionSession {
  localDate: string;
  serverTimestamp: string;
  questions: DailyQuestionState[];
  completedCount: number;
  dayComplete: boolean;
  currentStreak: number;
  longestStreak: number;
  coins: number;
}
```

- [ ] SQL-test UTC+3, UTC-12/+14 boundaries, invalid dates, anonymous calls,
  locked result privacy, answered results, and empty days.
- [ ] Validate local date against a supplied IANA timezone/offset and server
  timestamp; do not trust arbitrary historical/future dates.
- [ ] Return only current user choices and permitted aggregates.
- [ ] Add a TypeScript runtime guard for the RPC response.
- [ ] Replace 4–7 sequential daily requests with one main request.
- [ ] Keep voting atomic/idempotent and invalidate/refetch the session once
  after mutation.
- [ ] Record measured before/after request counts.
- [ ] Commit:

```bash
git add supabase/migrations/033_daily_question_session.sql supabase/tests features/daily-questions "app/(tabs)/index.tsx" lib/votes.ts
git commit -m "perf: replace daily question N+1 requests"
```

### Task 11: Split the home screen and make effects durable

**Files:**

- Create: `features/daily-questions/components/DailyQuestionScreen.tsx`
- Create: `features/daily-questions/components/DailyResultsScreen.tsx`
- Create: `features/daily-questions/components/PartialResultsScreen.tsx`
- Create: `features/daily-questions/components/DailyQuestionHeader.tsx`
- Create: `features/daily-questions/hooks/useVoteSubmission.ts`
- Create: `features/rewards/hooks/usePostVoteEffects.ts`
- Create: `features/rewards/services/rewardService.ts`
- Create focused tests under each feature
- Reduce: `app/(tabs)/index.tsx` to composition

- [ ] Characterize current loading, error, active, partial, and complete UI with
  tests before moving code.
- [ ] Move vote state/session transitions to one reducer or focused hook.
- [ ] Move share, friends, live events, personality, and mystery-box rendering
  behind explicit props; do not create one replacement giant hook.
- [ ] Track timer IDs and clear all timeouts/intervals on unmount.
- [ ] Bind reward effects to server completion/event IDs; remounting must not
  award or reschedule again.
- [ ] Remove production `any` in touched paths and memoize theme styles where
  profiling shows benefit.
- [ ] Use React Profiler/request instrumentation to record rerenders and request
  count before/after.
- [ ] Commit in focused slices, ending with:

```bash
git add "app/(tabs)/index.tsx" features
git commit -m "refactor: compose home screen from daily feature boundaries"
```

### Task 12: Establish shared data ownership and deduplication

**Decision gate:**

Measure duplicate profile, coin, friend, leaderboard, personality, and
community requests after Tasks 10–11. Choose TanStack Query only if its cache,
mutation invalidation, focus/reconnect integration, and request deduplication
replace enough custom code to justify bundle cost.

**If TanStack Query is chosen:**

- Create `lib/data/queryClient.ts`, `lib/data/queryKeys.ts`,
  `providers/DataProvider.tsx`.
- Add one documented dependency and record bundle delta.
- Migrate profile, coins, friends, leaderboard, personality, and community in
  small commits with explicit stale times and mutation invalidation.

**If not chosen:**

- Create `lib/data/requestCache.ts` with keyed in-flight deduplication, TTL,
  invalidation, foreground, and reconnect hooks.

**Required behavior:**

```ts
export const queryKeys = {
  profile: ['profile'] as const,
  coins: ['coins'] as const,
  friends: ['friends'] as const,
  leaderboard: (scope: 'global' | 'friends') => ['leaderboard', scope] as const,
  personality: ['personality'] as const,
  community: (sort: SortMode) => ['community', sort] as const,
};
```

- [ ] Add tests for concurrent deduplication, stale/fresh reads, mutation
  invalidation, permanent validation errors, reconnect, and foreground.
- [ ] Ensure one profile request per screen load and retain cached UI safely.
- [ ] Document the decision and measured bundle/request impact.
- [ ] Commit:

```bash
git add package.json package-lock.json lib/data providers hooks docs/architecture.md
git commit -m "perf: deduplicate shared backend data"
```

### Task 13: Add complete CI, SQL, E2E, and build-readiness gates

**Files:**

- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/secret-guard.yml`
- Create: `.maestro/config.yaml`
- Create flows under `.maestro/flows/`
- Create: `docs/testing/e2e.md`
- Create: `scripts/e2e-seed.mjs`
- Create: `scripts/e2e-cleanup.mjs`
- Create: `scripts/build-readiness.mjs`
- Modify: `package.json`

**CI order:**

```text
checkout -> Node 20 -> npm ci -> secret scan -> lint -> typecheck
-> three validators -> Jest -> Expo Doctor -> Supabase reset/SQL tests
-> build-readiness
```

- [ ] Add Maestro smoke flows for fresh install/auth/onboarding, question load,
  vote/results/three-completion, duplicate prevention, retry, deep link,
  friend code, community submit/insufficient coins, notification denial,
  paywall, and offline recovery.
- [ ] Use only local/staging seeded accounts and deterministic dates; never
  production data.
- [ ] Keep paid EAS jobs opt-in and fail clearly if explicitly enabled without
  credentials.
- [ ] Add branch protection required-check recommendations.
- [ ] Commit:

```bash
git add .github .maestro scripts package.json docs/testing docs/release
git commit -m "test: add critical mobile and database release gates"
```

---

## P2 tasks

### Task 14: Design account linking, recovery, deletion, and export

**Files:**

- Create: `lib/identity/types.ts`
- Create: `lib/identity/client.ts`
- Create: `hooks/useIdentity.ts`
- Create: `docs/security/account-recovery.md`
- Add UI only after provider flows can be configured safely

**Interface:**

```ts
export type IdentityProvider = 'apple' | 'google' | 'email_magic_link';

export interface IdentityClient {
  link(provider: IdentityProvider): Promise<LinkResult>;
  refresh(): Promise<void>;
  signOut(): Promise<void>;
  requestExport(): Promise<void>;
  requestDeletion(): Promise<void>;
}
```

- [ ] Preserve the anonymous user ID and data during linking.
- [ ] Test cancellation, already-linked provider, refresh, logout, deletion,
  and export request behavior.
- [ ] Document Apple/Google/email external setup without credentials.
- [ ] Commit:

```bash
git add lib/identity hooks/useIdentity.ts docs/security/account-recovery.md
git commit -m "feat: add account recovery and linking foundation"
```

### Task 15: Add privacy-safe provider-neutral analytics

**Files:**

- Create: `lib/analytics/events.ts`
- Create: `lib/analytics/types.ts`
- Create: `lib/analytics/client.ts`
- Create: `lib/analytics/index.ts`
- Create tests and `docs/analytics.md`

**Rules:**

- Typed events only.
- No raw UUID, friend code, user-generated text, access token, or arbitrary
  metadata.
- Event IDs/dedupe keys prevent rerender duplicates.
- Default adapter is no-op until privacy review/vendor credentials exist.

- [ ] Implement the event list and main funnel from the specification.
- [ ] Test payload rejection/redaction and duplicate prevention.
- [ ] Instrument stable user actions, not render events.
- [ ] Commit:

```bash
git add lib/analytics docs/analytics.md app hooks features
git commit -m "feat: add privacy-safe analytics boundary"
```

### Task 16: Complete moderation operations and remote configuration

**Files:**

- Create forward migration: `supabase/migrations/034_moderation_remote_config.sql`
- Create SQL tests: `supabase/tests/034_moderation_remote_config.test.sql`
- Create: `lib/remoteConfig/types.ts`
- Create: `lib/remoteConfig/defaults.ts`
- Create: `lib/remoteConfig/validate.ts`
- Create: `lib/remoteConfig/client.ts`
- Create tests and operational docs

**Remote config model:**

```ts
export interface RemoteConfig {
  minimumSupportedVersion: string | null;
  maintenanceMode: boolean;
  notificationSchedule: { morning: number; afternoon: number; evening: number };
  rewardMultiplier: number;
  dailyQuestionCount: number;
  features: {
    liveEvents: boolean;
    communitySubmissions: boolean;
    paywall: boolean;
  };
  experimentVariant: string | null;
}
```

- [ ] Make config read-only to clients and mutation service-role/moderator only.
- [ ] Validate ranges/types, cache last-known-good values, and use safe defaults.
- [ ] Add kill switches without allowing store-policy bypass.
- [ ] Complete approve/reject/promote/quarantine moderator RPCs with reason
  codes and append-only audits.
- [ ] Commit:

```bash
git add supabase/migrations/034_moderation_remote_config.sql supabase/tests lib/remoteConfig docs
git commit -m "feat: add moderation and remote config foundations"
```

### Task 17: Reconcile documentation and produce the final audit

**Files:**

- Modify: `README.md`
- Modify: `README.tr.md`
- Create/update: `CHANGELOG.md`
- Create/update: `docs/architecture.md`
- Create/update: `docs/product-overview.md`
- Create/update: `docs/environment.md`
- Update all `docs/testing/`, `docs/database/`, `docs/security/`,
  `docs/release/`, `docs/audits/`
- Create: `docs/audits/production-hardening-final.md`
- Relabel historical `tasks/` documents; do not present them as current truth

- [ ] Reconcile actual bundle IDs, setup commands, Node version, migrations,
  license wording, web limitations, Supabase requirements, payments,
  monitoring, and store status.
- [ ] Separate implemented, tested, configured, deployed, and released states.
- [ ] Record current backlog, changelog, known limitations, external setup, and
  remaining risks.
- [ ] Add manual QA, App Store, and Play Store checklists.
- [ ] Run the complete verification gate:

```bash
npm ci
npm run secrets:check
npm run lint
npm run typecheck
npm run validate:questions
npm run validate:personality-signals
npm run validate:personality-weights
npm test -- --runInBand
npx expo-doctor
npm run db:verify
npm run db:test
npm run e2e:smoke
npm run build:readiness
```

- [ ] Record exact results, migration verification, request counts, dependency
  bundle impact, commit list, changed files, external setup, risks, and PR
  description in the final audit.
- [ ] Commit:

```bash
git add README.md README.tr.md CHANGELOG.md docs tasks
git commit -m "docs: align production and release documentation"
```

**Acceptance:** Documentation matches the checked repository and the final
audit contains all 23 requested deliverables.

---

## Completion checkpoints

### P0 checkpoint

Run all baseline commands plus `supabase db reset` and P0 SQL tests. Do not
start P1 if trusted-state, community, auth, purchase, Expo Doctor, or migration
verification is red.

### P1 checkpoint

Measure:

- one main daily-session backend request after auth;
- no global leaderboard download for friends;
- no duplicate notification IDs;
- no duplicate profile request during a screen load;
- no uncontrolled timers;
- no N+1 daily restoration;
- home route reduced to composition and feature coordination.

### Final checkpoint

Every command in Task 17 must pass or have an exact, externally blocked reason
documented in the final audit. Never mark the work complete while a required
in-repository fix remains.
