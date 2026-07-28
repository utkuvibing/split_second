# Production Hardening Baseline Audit

**Repository:** `utkuvibing/split_second`

**Audited branch:** `hardening/production-readiness-v2` (created from `master`)

**Audit date:** 2026-07-28

**Audit scope:** Phase 0 only; no application code or existing migration was changed

**Overall result:** **Not production-ready**

## Executive summary

The repository has a working Expo SDK 54 / React Native 0.81 foundation, strict
TypeScript, a reproducible lockfile, 37 Jest suites, and 334 passing tests.
Question and personality data validators pass. Those green checks do not cover
the most important production risks.

Confirmed P0 blockers are:

1. Authentication failure can leave the home screen loading forever.
2. Client-accessible RLS policies and RPCs permit direct mutation or farming of
   premium, coins, streaks, badges, cosmetics, friendships, and mystery-box
   state.
3. Community-question rows are broadly readable, including rejected content,
   raw author UUIDs, report counts, and moderation fields.
4. Most `SECURITY DEFINER` functions have no fixed `search_path`, explicit
   unauthenticated guard, or least-privilege execution grants.
5. The paywall is a development stub, not a real purchase flow.
6. Notification reconciliation can cancel unrelated notifications and creates
   duplicate streak reminders.
7. Daily question restoration uses an N+1 request pattern, and friend
   leaderboards download up to 1,000 global records for local filtering.
8. Expo Doctor fails because five SDK packages are behind required patch
   versions.
9. There is no verified local Supabase workflow, SQL security test harness, or
   E2E suite.
10. CI uses inconsistent Node versions and non-reproducible installation
    commands, omits lint and Expo Doctor, and targets stale branches.

The existing passing tests are valuable but heavily mock the database and do
not validate RLS, grants, RPC abuse resistance, notification reconciliation,
purchase trust, or the complete home-screen flow.

## Repository inventory

| Area | Baseline |
|---|---:|
| Tracked files | 304 |
| App routes | 9 files |
| Components | 71 files |
| Hooks | 37 files |
| Library modules | 57 files |
| Type modules | 2 files |
| Migrations | 29 files (`001` through `029`) |
| Workflow files | 2 |
| Jest suites | 37 |
| Jest tests | 334 |
| Largest route | `app/(tabs)/index.tsx`, 733 lines |
| Largest application module | `lib/i18n.ts`, 962 lines |

The worktree already contained untracked local/generated files and a local
ignored `.env`. They were preserved and were not staged. The secret check
confirmed that `.env` is not tracked.

## Platform and dependency compatibility

| Item | Current state | Assessment |
|---|---|---|
| Expo | `54.0.34` | SDK 54 is correct; patch is behind Doctor expectation `~54.0.36` |
| React Native | `0.81.5` | Correct Expo SDK 54 generation |
| React | `19.1.0` | Compatible with the installed RN/Expo generation |
| Expo Router | `6.0.23` | Patch behind Doctor expectation `~6.0.24` |
| TypeScript | lockfile resolves `5.9.3` | Compatible; strict mode enabled |
| Node used for audit | `24.11.1` | Not aligned with CI or EAS |
| npm used for audit | `11.13.0` | No project-pinned version |
| Lockfile | v3 | Present and accepted by `npm ci` |

### Expo Doctor mismatch

`npx expo-doctor` passed 17 of 18 checks and failed dependency validation:

| Package | Expected | Found |
|---|---:|---:|
| `expo` | `~54.0.36` | `54.0.34` |
| `expo-file-system` | `~19.0.23` | `19.0.22` |
| `expo-font` | `~14.0.12` | `14.0.11` |
| `expo-localization` | `~17.0.9` | `17.0.8` |
| `expo-router` | `~6.0.24` | `6.0.23` |

This is understood as a patch-alignment problem, not an SDK-major mismatch.
It remains a release blocker until versions and the lockfile are updated and
Doctor passes.

### Installation and dependency findings

- `npm ci` succeeds, but it inherits `legacy-peer-deps=true` from `.npmrc`.
- `npm ci --dry-run --legacy-peer-deps=false` also succeeds. No current peer
  conflict justifies the repository-wide legacy setting.
- `eas.json` repeats `NPM_CONFIG_LEGACY_PEER_DEPS=true` in the production
  profile.
- `@testing-library/jest-native` is deprecated because its matchers are now
  provided by React Native Testing Library.
- `eslint@8.57.1` is end-of-life.
- `@expo/ngrok` is a development tunnel tool but is declared as a production
  dependency.
- `npm ci` reports 32 audit findings: 2 low, 17 moderate, 11 high, and 2
  critical. `npm audit --omit=dev` still reports 26: 1 low, 15 moderate, 8
  high, and 2 critical. The critical transitive packages are `shell-quote`
  and `tar`; the high set includes `@xmldom/xmldom`, `brace-expansion`,
  `js-yaml`, `minimatch`, `picomatch`, `postcss`, `undici`, and `ws`.
- Most audit findings are transitive through Expo/React Native tooling.
  Blind `npm audit fix --force` is unsafe; update within Expo SDK 54
  compatibility first and document residual toolchain exposure.
- No `.nvmrc` or `package.json.engines` exists.
- Node differs across environments: local audit 24, CI test 22, CI EAS 20.

## Existing build and release behavior

- Local scripts exist for Expo start, Android, iOS, web, Jest, coverage, lint,
  TypeScript, secrets, and three data validators.
- There is no single build-readiness script.
- CI uses `npm install --legacy-peer-deps`, not `npm ci`.
- CI runs typecheck, the three validators, and Jest.
- CI does not run lint, Expo Doctor, or the secret guard within the main job.
  A separate secret workflow exists.
- Workflows trigger on `master`, `main`, and stale `hermes-v1`.
- The paid EAS job only runs on `hermes-v1`, despite `master` being the real
  default branch.
- CI test uses Node 22; EAS uses Node 20.
- The production EAS profile forces legacy peer dependency resolution.
- `app.json` has no iOS `buildNumber` or Android `versionCode`.
- `docs/build-readiness.md` says the iOS identifier is
  `com.splitsecond.app`, while `app.json` uses `com.splitsecond.ios`.
- Android uses `com.splitsecond.app`, so documentation currently conflates
  the platform identifiers.

## Baseline command results

| Command | Result | Details |
|---|---|---|
| `npm ci` | Pass with warnings | 1,392 packages installed; 32 audit findings; legacy peer mode inherited from `.npmrc` |
| `npm run secrets:check` | Pass | `verify-no-secrets: OK`; local `.env` is ignored and untracked |
| `npm run lint` | Pass with warnings | 0 errors, 91 warnings |
| `npm run typecheck` | Pass | 0 TypeScript errors |
| `npm run validate:questions` | Pass | 214 questions; 22 dating; dates 2026-05-29 through 2026-08-08 |
| `npm run validate:personality-signals` | Pass | 214 questions and 214 signals; 22 dating |
| `npm run validate:personality-weights` | Pass | 8 types; SQL weights match JSON |
| `npm test -- --runInBand` | Pass with noisy errors | 37 suites, 334 tests, 0 failures, 0 snapshots |
| `npx expo-doctor` | **Fail** | 17/18 checks; five patch mismatches |

### Current coverage

`npm run test:coverage -- --runInBand --silent`:

| Metric | Coverage |
|---|---:|
| Statements | 41.72% |
| Branches | 34.22% |
| Functions | 33.90% |
| Lines | 44.02% |

Coverage is much lower than historical task reports claiming 89.52%.
Important zero-coverage areas include notifications, premium, leaderboard,
community questions, friends, coins, cosmetics, mystery boxes, live events,
and many hooks.

### Test infrastructure quality

- Every suite prints repeated `console.error` messages because
  `jest.setup.js` deliberately marks Expo Winter globals non-configurable.
- Passing tests therefore produce thousands of lines of error output and can
  hide real failures.
- Auth tests assert that rejected auth becomes `userId: null`; they do not
  assert a user-visible error state or retry.
- The unauthenticated `useTodayQuestions(false)` test does not assert
  `loading === false`, so it misses the confirmed infinite spinner.
- Security-sensitive behavior is tested only through mocks; there are no RLS
  or SQL integration tests.
- No coverage thresholds are configured.

## Confirmed security findings

Severity here reflects production impact. The later
`docs/security/security-review-v2.md` must expand each item with formal
evidence, verification, and remaining limitations.

### Critical

#### C-01: Client can mutate trusted profile and economy state

Evidence:

- Migration `008_premium.sql` creates `FOR ALL` policies on `user_profiles`,
  `user_cosmetics`, and `user_equipped` using only
  `auth.uid() = user_id`.
- `user_profiles` contains `is_premium`, `premium_until`, and `coins`.
- `coin_transactions`, `user_streaks`, `user_badges`, `friendships`,
  `friend_requests`, `user_mystery_boxes`, and `user_boosts` also expose broad
  own-row writes.

Risk:

An authenticated client can directly forge premium, currency, streaks,
badges, cosmetics, friendships, requests, boxes, boosts, and transaction
history through the Supabase client, bypassing product rules and payment
trust.

Required direction:

Replace broad policies with column-safe read policies and server-owned mutation
RPCs. Revoke direct client writes to trusted economy and entitlement fields.

#### C-02: Reward and purchase RPCs trust client assertions

Evidence:

- `dev_add_coins(p_amount)` is deployed as a callable `SECURITY DEFINER`
  function with no production guard or restricted grant.
- `award_badge_coins()` can be called repeatedly and does not bind an award to
  a newly verified badge.
- `unlock_badge(p_badge_id)` accepts arbitrary badge IDs.
- `purchase_cosmetic_with_coins(p_cosmetic_id, p_price)`,
  `purchase_avatar(p_avatar_id, p_price)`, and
  `set_display_name(p_name, p_cost)` trust client-provided prices/costs.
- Legacy `purchase_cosmetic(p_cosmetic_id)` grants any cosmetic for free.
- `send_friend_request(..., p_is_premium)` trusts a client-provided premium
  flag to bypass limits.

Risk:

Clients can mint coins, unlock arbitrary rewards, buy items for zero or
negative prices, avoid rename costs, acquire cosmetics for free, and bypass
friend limits.

Required direction:

Make catalogs, prices, entitlement checks, and reward eligibility
server-owned; remove production execution from development RPCs and legacy
free purchase paths.

#### C-03: Mystery boxes can be farmed independently of voting

Evidence:

`check_mystery_box_drop()` increments `votes_since_box` on every RPC call and
does not verify that a new eligible daily completion or vote caused the call.
Repeated direct calls eventually guarantee a drop. Broad table policies also
permit own-row mutation.

Risk:

Users can farm a box every cooldown period and forge box state or rewards.

Required direction:

Bind drop checks to a unique server-recorded completion event and idempotency
key; make box, pity, and boost rows server-write-only.

### High

#### H-01: Community raw-table access leaks moderation and identity data

Evidence:

`community_questions` has `FOR SELECT USING (true)`. The raw row contains
`author_id`, rejected content, status, report count, promotion date, and audit
timestamps.

Risk:

Ordinary clients can bypass the curated RPC and read rejected content,
moderation data, report counts, and raw author UUIDs.

Required direction:

Remove broad table reads and expose only a safe authenticated feed RPC/view.

#### H-02: Community RPCs are insufficiently constrained

Evidence:

- No fixed `search_path` or explicit unauthenticated guard.
- No explicit `REVOKE`/least-privilege `GRANT`.
- Limit and offset are not clamped.
- Invalid sort values silently become `hot`.
- Category values are unrestricted.
- Identical or near-identical options are accepted.
- Pending content is shown in the ordinary feed.
- Feed exposes author friend codes.
- Reports share the same uniqueness row as up/down votes, so changing a report
  to a vote removes the report.
- Moderation is only an automatic `rejected` transition at five reports; there
  is no quarantine, moderator authorization, or audit trail.

Risk:

Data leakage, expensive queries, moderation abuse, and inconsistent counters.

#### H-03: `SECURITY DEFINER` defaults are broadly unsafe

Static inventory found 62 `SECURITY DEFINER` definitions representing 41
distinct function names. Only 9 definitions set `search_path`; 53 do not.
Only the recent personality and inventory migrations include meaningful
explicit execution revokes/grants.

PostgreSQL grants function execution to `PUBLIC` by default. Consequently,
many privileged functions are reachable by roles that were never explicitly
intended to call them.

Required direction:

In forward-only migrations, redefine active privileged functions with
`SET search_path = pg_catalog, public` (or a narrower safe equivalent), reject
null `auth.uid()` where user context is required, revoke from `PUBLIC` and
`anon`, and grant only the required roles.

#### H-04: Raw votes and live-event votes are publicly readable

Evidence:

- `votes` has `FOR SELECT USING (true)` and contains raw `user_id`,
  `question_id`, choice, timestamps, and vote timing.
- `live_event_votes` also has public select.
- The client directly reads `question_results`.

Risk:

User behavior can be correlated by UUID and future/locked results can be
queried outside intended UI gating.

Required direction:

Make raw vote tables private; expose aggregate results through permission-aware
RPCs/views only after policy conditions are met.

#### H-05: Friend/privacy boundaries are client-writable

Evidence:

`friendships` and `friend_requests` use `FOR ALL` policies that allow any
participant to write matching rows directly. RPCs expose raw friend UUIDs and
friend codes. The global leaderboard returns raw user UUIDs.

Risk:

Unauthorized relationship creation/status mutation and unnecessary stable
identifier exposure.

Required direction:

Make relationship tables read-only to clients, mutate only through hardened
RPCs, and return opaque/public display identifiers rather than raw UUIDs or
friend codes where not required.

### Medium

- `submit_vote_and_get_results` does not explicitly reject null users, validate
  unlocked time slots, clamp vote time, or set a fixed `search_path`.
- Client-local dates are accepted within server `CURRENT_DATE ± 1`; this
  supports timezones but needs explicit timezone-offset validation and replay
  tests.
- Several reward flows are initiated by client effects and are not bound to
  durable idempotency records.
- Friend codes use six characters from a 31-character alphabet. They are not
  trivially predictable, but online lookup requires server-side rate limits
  and attempt logging.
- Anonymous authentication has no account-linking, recovery, export, or
  deletion flow despite substantial stored value.
- The secret scanner checks a useful but narrow set of patterns and is not a
  substitute for a standard history-aware scanner.

## Authentication and loading findings

### Confirmed infinite loading

Call path:

```text
HomeScreen
  -> useAuth()
     -> initAuth()
        -> auth.getSession()
        -> auth.signInAnonymously()
  -> useTodayQuestions(Boolean(userId))
```

If session restoration throws or anonymous login fails:

1. `useAuth` swallows the error and finishes with `userId === null`.
2. `useTodayQuestions(false)` returns early without changing its initial
   `loading === true`.
3. Home computes `authLoading || questionLoading`, which remains true forever.
4. No auth error or retry state is rendered.

Additional issues:

- `auth.getSession()` ignores its returned `error`.
- A null session with no Supabase error is treated as an ordinary null result.
- Multiple screens instantiate independent `useAuth()` calls; there is no
  provider or in-flight deduplication.
- Hooks do not guard state updates after unmount.
- `lib/supabase.ts` uses non-null assertions for missing configuration, so
  configuration errors are not represented safely.

## Notification findings

Confirmed behavior in `lib/notifications.ts` and `app/(tabs)/index.tsx`:

- Daily scheduling uses one boolean AsyncStorage flag, not real Expo IDs.
- First scheduling calls `cancelAllScheduledNotificationsAsync()`, which can
  remove unrelated live-event or system-owned reminders.
- The stored boolean cannot reconcile timezone, locale, schedule, or content
  changes.
- `scheduleStreakReminder()` schedules a new daily 21:00 notification without
  checking or replacing an existing ID.
- Post-vote effects call both daily and streak scheduling after every
  `lastVoteResult` change/remount.
- Permission can therefore be requested from a post-vote effect instead of a
  user-controlled preference flow.
- Notification failures are not caught at the effect boundary and returned
  promises are not awaited.
- Notifications have zero test coverage.

## Premium and purchase findings

- `Paywall.handlePurchase()` only calls `setDevPremium(true)`.
- Restore uses the same handler as purchase.
- `setDevPremium()` itself is not guarded by `__DEV__`, though
  `getDevPremium()` refuses to read it in production.
- Therefore the production CTA can appear to perform a purchase, close the
  paywall, and call `onPurchased`, but it cannot create a trusted entitlement.
- Hardcoded localized price strings are not connected to store products.
- There is no StoreKit/Play Billing/RevenueCat client, server verification,
  webhook, or trusted entitlement source.
- `user_profiles.is_premium` is client-writable through current RLS.

The safe production behavior is to disable purchase and restore with a clear
configuration state until a trusted provider is configured. Development
simulation must remain compile-time gated.

## Performance and data-fetching findings

### Daily session request count

Static call-graph baseline after authentication:

- 1 request for today's questions.
- Up to 3 sequential vote lookups, one per question.
- Up to 3 additional sequential result lookups, one per answered question.
- Main daily restoration therefore uses **4 to 7 backend requests**, excluding
  auth/session storage and noncritical feature requests.
- Because the loop uses `await`, the calls are serialized.
- `getUserVote()` also reads the session for every question.

The home route independently loads badges, premium/profile, personality,
global stats, and live events, so the first useful UI competes with additional
RPCs. Optional data is not centrally prioritized.

### Friend leaderboard

`fetchFriendLeaderboard()` concurrently fetches:

- global leaderboard with `p_limit = 1000`; and
- the user's friend list.

It filters and reranks on the device. This omits a friend outside the returned
global top 1,000, downloads private identifiers unnecessarily, and scales
poorly.

### Duplicate ownership and caching

- No query cache or request-deduplication layer exists.
- `usePremium()` is mounted in home, profile, `LeaderboardList`, and the shop.
  Each instance calls `get_or_create_profile`.
- `useAuth()` is independently mounted by home, leaderboard, profile, and deep
  link routes.
- Profile simultaneously loads premium/profile, coins, stats, history,
  badges, personality, friends, and friend requests, with overlapping data.
- Matching loads personality and friends again, plus compatibility.
- The tab navigator does not specify lazy screen loading, so inactive-tab
  behavior must be measured on device and should not be assumed efficient.

### Rendering and timers

- `app/(tabs)/index.tsx` owns 20+ state/ref values and composes authentication,
  voting, rewards, notifications, personality, friends, live events, sharing,
  and mystery boxes.
- 43 components/routes recreate a theme-derived `StyleSheet` during render.
- Home creates delayed mystery-box and personality timers without storing or
  clearing their IDs on unmount.
- Several modal callbacks also schedule untracked timeouts.
- Reward guard refs reset on remount; server uniqueness protects some badge
  operations, but mystery-box checks and notifications remain repeatable.
- Several long profile/matching views use `ScrollView` with mapped collections
  rather than virtualized lists.

No runtime instrumentation currently measures backend request count,
home-screen rerenders, FlatList frame performance, or bundle size. The figures
above are static call-graph counts and must be replaced with measured before
and after values during implementation.

## Error handling and observability findings

- Silent `.catch(() => {})` and empty `catch` blocks exist across auth, badges,
  friend votes, onboarding, home post-vote effects, coins, cosmetics, friends,
  premium, sounds, and sharing.
- Data-layer functions often convert backend errors into `[]`, `null`, or
  `false`, making “empty data” indistinguishable from failure.
- Vote failure resets the spinner but shows no user-visible error.
- Community feed failure becomes an empty feed.
- Raw backend error strings can be rendered by the home question error state.
- Logging is unstructured `console.error`/`console.warn`.
- No Sentry or other production monitoring adapter exists.
- No analytics implementation exists.
- No log redaction policy or typed error taxonomy exists.

## Architecture findings

- The 733-line home route is a confirmed god component, not merely a size
  concern. It owns unrelated side effects and domain state.
- `useMultiVote` is nested inside the route and daily-session restoration is
  embedded in a screen effect, limiting isolated tests.
- Business rules are duplicated between client constants and SQL:
  notification times, product prices, nickname cost, community submission
  cost, friend limits, reward amounts, and daily counts.
- Supabase response types are cast without runtime validation.
- Production code contains at least 23 explicit `any` occurrences.
- Feature state is distributed across independent hooks without shared cache
  ownership or invalidation rules.
- Localization is centralized and supports Turkish and English; it must be
  preserved during decomposition.

## Supabase local development and migration findings

- Migrations are numbered in order from `001` through `029`.
- Several functions are redefined repeatedly; the final schema must be
  reconstructed by reading later migrations.
- `docs/migration-runbook.md` says there are only 23 migrations and stops at
  `023`; it is stale.
- `supabase/config.toml` is missing.
- Supabase CLI is not installed on `PATH`.
- Docker is not installed on `PATH` in the audit environment.
- No SQL test suite, RLS verification, RPC smoke test, or migration CI job
  exists.
- Seeds are split among `seed.sql`, `seed_translations.sql`, `seed_v2.sql`,
  canonical JSON/scripts, and local untracked seed artifacts. There is no one
  documented deterministic reset source.
- Migration `017` assumes the `supabase_realtime` publication exists.
- Migration execution from an empty database was **not verified** in Phase 0
  because the required local runtime is absent. This is a documented blocker,
  not a passing result.

## End-to-end testing findings

- No Maestro, Detox, or other E2E configuration is tracked.
- There is no deterministic mobile test environment or stable test-account
  strategy.
- There are no automated flows for onboarding, anonymous auth, three votes,
  retry, deep links, friends, community submission, paywall, notifications, or
  offline recovery.

## Documentation findings

- Historical task reports claim 273/301 tests and up to 89.52% coverage; the
  current baseline is 334 tests and 41.72% statement coverage.
- Some historical reports label the product production-ready despite the
  confirmed security and release blockers.
- `docs/migration-runbook.md` omits migrations `024` through `029`.
- `docs/build-readiness.md` has an incorrect iOS bundle identifier and stale
  dependency/setup statements.
- README setup permanently recommends `--legacy-peer-deps` although strict
  dependency resolution succeeds.
- README says Node >=18, while CI uses 20/22 and the project has no pinned
  supported version.
- There is no `CHANGELOG.md`, architecture document, environment guide,
  current security review, E2E guide, branch-protection guide, RPC reference,
  account recovery design, analytics specification, moderation runbook, or
  remote-config specification.
- Implemented, tested, configured, deployed, and released states are mixed in
  historical task trackers.
- Repository license wording says “Private — All rights reserved”; no separate
  license file was found. This must be confirmed rather than inferred.

## Existing analytics, monitoring, moderation, recovery, and configuration

| Capability | Baseline |
|---|---|
| Analytics | None |
| Production error monitoring | None; ErrorBoundary logs to console |
| Community moderation | Status column, counters, automatic reject at 5 reports |
| Moderator authorization | None |
| Moderator audit records | None |
| Remote configuration | None |
| Feature flags | Local constants only |
| Account recovery/linking | None; anonymous auth only |
| Data export/deletion flow | None |
| Purchase provider | None |

## Confirmed issues

1. Auth failure can cause infinite home loading.
2. Auth errors are swallowed and have no retry UI.
3. Daily notification setup can cancel unrelated reminders.
4. Streak reminders can be duplicated.
5. Community raw-table reads expose restricted fields and rejected content.
6. Community feed limit/offset/sort/category/input validation is incomplete.
7. Most privileged RPCs have unsafe default execution posture.
8. Trusted economy and entitlement fields are client-writable.
9. Multiple reward/purchase RPCs trust client-provided eligibility or prices.
10. Mystery boxes can be farmed by direct RPC replay.
11. Friend request premium status is client asserted.
12. Friend leaderboard downloads and filters 1,000 global rows.
13. Daily vote restoration is sequential N+1.
14. Premium purchase/restore are fake local actions.
15. Vote and several background failures are invisible to users.
16. Home route is oversized and tightly coupled.
17. Duplicate auth/profile/data requests have no central ownership.
18. CI installation is non-reproducible and quality gates are incomplete.
19. Expo Doctor fails.
20. No E2E or database security integration tests exist.
21. Local Supabase reset/migration workflow is incomplete and unverified.
22. Documentation is materially stale.
23. No monitoring, analytics, recovery, moderator tooling, or remote-config
    foundation exists.

## Suspected issues requiring runtime or database verification

1. Inactive top tabs may eagerly mount and amplify initial RPC count.
2. Home remounts may repeat notification and mystery-box side effects.
3. Untracked delayed callbacks may update state after unmount.
4. Concurrent reward calls may race because several functions do not lock or
   use unique idempotency records.
5. Current local-date validation may behave incorrectly near the International
   Date Line even though UTC±3 is accepted.
6. Migration `001` through `029` may not apply cleanly to an empty current
   Supabase image.
7. Realtime publication setup may fail or duplicate on reset.
8. Android/iOS notification triggers may differ around daylight-saving and
   timezone changes.
9. The app may expose more raw UUIDs through final-schema RPC variants than
   static TypeScript consumers require.
10. ScrollView-based profile/matching collections may become slow with large
    histories or friend counts.

## Release blockers

### P0 blockers

- Trusted database state is client-writable.
- Privileged RPCs and grants are not hardened.
- Authentication can hang indefinitely.
- Community raw access and moderation privacy are unsafe.
- Purchase UX is not backed by a trusted entitlement.
- Expo Doctor fails.
- Clean migration and RLS behavior are unverified.

### P1 blockers

- Duplicate/unsafe notification scheduling.
- Daily session and friend leaderboard request patterns.
- No structured error handling or production monitoring boundary.
- Home architecture and repeatable effects.
- CI reproducibility and missing checks.
- No critical E2E smoke coverage.

### P2 readiness gaps

- Account linking/recovery.
- Analytics foundation.
- Moderation operations and audit records.
- Remote configuration and kill switches.
- Documentation hierarchy and store checklists.

## Recommended implementation order

### P0: production blockers

1. Align Node/npm/Expo patch versions and make the baseline gates reproducible.
2. Add structured auth state, retry, shared ownership, and non-hanging question
   loading with regression tests.
3. Add an emergency forward-only security migration that removes direct writes
   to premium/economy/social/reward state, revokes development RPCs, fixes
   privileged function posture, and adds SQL verification.
4. Harden community access/RPCs/moderation primitives in a separate
   forward-only migration and integration test set.
5. Add a server-side friend leaderboard RPC and remove global client filtering.
6. Replace the fake paywall behavior with a purchase abstraction that is
   safely unavailable in production until externally configured.
7. Establish local Supabase configuration and prove all migrations on a clean
   database before accepting database changes.

### P1: architecture and reliability

1. Introduce typed errors, safe logging, user-visible retry paths, and a
   monitoring adapter.
2. Refactor notifications into permission, storage, and idempotent scheduler
   boundaries.
3. Add a typed `get_daily_question_session` RPC and replace N+1 restoration.
4. Split the home route into daily-session, voting, post-vote, reward, and
   optional-feature boundaries with timer cleanup and durable idempotency.
5. Establish shared cache/request ownership. Evaluate TanStack Query against
   measured needs before adding it.
6. Add CI gates, branch protection guidance, database tests, Maestro smoke
   flows, and build-readiness checks.

### P2: growth and operations

1. Add anonymous account linking/recovery design and provider-neutral identity
   boundaries.
2. Add provider-neutral analytics with typed, privacy-safe events.
3. Add moderator roles, quarantine workflow, audit records, and operational
   documentation.
4. Add validated, cached, server-owned remote configuration and kill switches.
5. Reconcile README, Turkish README, changelog, architecture, database,
   security, testing, release, and store-readiness documentation.

The task-by-task implementation plan is stored at
`docs/superpowers/plans/2026-07-28-production-readiness-v2.md`.

## Phase 0 completion condition

Phase 0 is complete when this audit and the prioritized implementation plan are
committed on the hardening branch. No P0 application or database implementation
is included in this phase.
