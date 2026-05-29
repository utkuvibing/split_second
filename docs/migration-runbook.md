# Split Second Migration Runbook

This repository currently has 23 migration files in `supabase/migrations/`, numbered `001` through `023`.
Run them in filename order against a fresh Supabase project before applying seed data.

## Prerequisites

- Supabase project created.
- Database connection string available as `SUPABASE_DB_URL`.
- App `.env` populated with the matching Supabase URL and anon key.
- Run these migrations on an empty project, or review conflicts first. Several files use `CREATE TABLE` without `IF NOT EXISTS` and are intended as one-time ordered migrations.

## Exact Commands

From the repository root, run the migrations in order:

```bash
export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres'

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/001_initial_schema.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/002_streaks.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/003_history_stats.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/004_global_stats.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/005_question_translations.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/006_badges.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/007_leaderboard.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/008_premium.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/009_coins.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/010_personality.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/011_friends.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/012_multiple_questions.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/013_nicknames.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/014_friend_requests.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/015_mystery_boxes.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/016_community_questions.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/017_live_events.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/018_avatars.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/019_nickname_cost.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/020_avatar_tiers.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/021_friend_personalities.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/022_mystery_box_daily_limit.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/023_community_daily_limit_1.sql
```

Equivalent one-liner:

```bash
for f in supabase/migrations/*.sql; do psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

In the Supabase Dashboard SQL Editor, open each file and run it manually in the same filename order.

## Migration Order

| Order | File | Purpose | Key Dependencies |
|---:|---|---|---|
| 001 | `001_initial_schema.sql` | Creates `questions`, `votes`, indexes, `question_results`, base `submit_vote_and_get_results`, and public/read/insert RLS policies. | Base migration. Requires Supabase Auth schema for `auth.uid()`. |
| 002 | `002_streaks.sql` | Adds `user_streaks`, RLS, and replaces vote RPC to update streaks and return streak data. | Depends on `questions`, `votes`, and the RPC from 001. |
| 003 | `003_history_stats.sql` | Adds `get_vote_history()` and `get_user_stats()` RPCs. | Depends on `votes`, `questions`, `question_results`, and `user_streaks`. |
| 004 | `004_global_stats.sql` | Adds `get_daily_stats()` for today's votes and total unique voters. | Depends on `votes` and `questions`. |
| 005 | `005_question_translations.sql` | Adds Turkish translation columns and updates `get_vote_history()` to return them. | Depends on `questions` and `get_vote_history()` from 003. |
| 006 | `006_badges.sql` | Adds `user_badges`, RLS, badge RPCs, and badge context calculation. | Depends on `votes`, `questions`, `question_results`, and `user_streaks`. |
| 007 | `007_leaderboard.sql` | Adds `get_leaderboard()` based on current and longest streaks. | Depends on `user_streaks`. Later replaced by 013 and 018. |
| 008 | `008_premium.sql` | Adds `user_profiles`, `user_cosmetics`, `user_equipped`, RLS, and profile/cosmetic/equip RPCs. | Depends on `auth.users`. Required before coin, friend, avatar, and community systems. |
| 009 | `009_coins.sql` | Adds `coins` to profiles, `coin_transactions`, coin rewards on voting, coin purchase, balance, badge/share coin RPCs, and updated profile RPC. | Depends on 008 plus `votes`, `questions`, `user_streaks`, and `user_cosmetics`. Replaces vote RPC again. |
| 010 | `010_personality.sql` | Adds `vote_time_seconds`, `user_personality`, personality context/save RPCs, and vote RPC accepting `p_vote_time`. | Depends on 009 objects, especially `user_profiles`, `coin_transactions`, and vote/streak tables. |
| 011 | `011_friends.sql` | Adds friend codes, `friendships`, friend-code generation, profile auto-code assignment, add/list/remove friend RPCs, and friend vote visibility. | Depends on `user_profiles`, `votes`, and 010-era profile RPC. |
| 012 | `012_multiple_questions.sql` | Adds `questions.time_slot`, replaces one-question-per-day uniqueness with `(scheduled_date, time_slot)`, and changes vote rewards/streaks for three daily questions. | Depends on `questions`, `votes`, `user_profiles`, `user_streaks`, and `coin_transactions`. Replaces vote RPC again. |
| 013 | `013_nicknames.sql` | Adds `display_name`, nickname validation, and updates profile, leaderboard, friends list, and friend vote RPCs to include display names. | Depends on `user_profiles`, `generate_friend_code()`, `user_equipped`, `user_streaks`, and `friendships`. |
| 014 | `014_friend_requests.sql` | Adds `friend_requests`, send/respond/list pending request RPCs, and changes `add_friend_by_code()` into an alias for request sending. | Depends on `user_profiles` and `friendships`. |
| 015 | `015_mystery_boxes.sql` | Adds mystery boxes, pity counter, boosts, drop/open/inventory RPCs, and reward application to coins/cosmetics/boosts. | Depends on `user_streaks`, `user_profiles`, `user_cosmetics`, and `coin_transactions`. |
| 016 | `016_community_questions.sql` | Adds community question submissions, community votes, feed/submission RPCs, moderation counters, 3-per-day limit, and 50-coin submission cost. | Depends on `user_profiles` and `coin_transactions`. |
| 017 | `017_live_events.sql` | Adds live events, live event votes, realtime publication entry, and live event fetch/submit RPCs with coin rewards. | Depends on `user_profiles`; `ALTER PUBLICATION supabase_realtime` requires the Supabase realtime publication to exist. |
| 018 | `018_avatars.sql` | Adds `avatar_id`, set-avatar/dev-add-coins RPCs, and updates profile, leaderboard, friends list, and friend vote RPCs to include avatars. | Depends on 011 and 013 social/profile objects plus `user_profiles`. |
| 019 | `019_nickname_cost.sql` | Replaces `set_display_name()` so renames can cost coins and record a transaction. | Depends on `user_profiles.display_name`, `user_profiles.coins`, and `coin_transactions`. |
| 020 | `020_avatar_tiers.sql` | Adds `user_owned_avatars`, avatar purchase RPC with coin deduction, and owned-avatar listing. | Depends on `user_profiles.coins` and `coin_transactions`. |
| 021 | `021_friend_personalities.sql` | Adds `get_friends_with_personality()` for friend compatibility axes. | Depends on `friendships`, `user_profiles.avatar_id/display_name/friend_code`, and `user_personality`. |
| 022 | `022_mystery_box_daily_limit.sql` | Replaces `check_mystery_box_drop()` with a 24-hour cooldown while retaining pity/drop logic. | Depends on `user_mystery_boxes` and `user_streaks.votes_since_box` from 015. |
| 023 | `023_community_daily_limit_1.sql` | Replaces `submit_community_question()` to reduce submissions from 3 to 1 per day. | Depends on `community_questions`, `user_profiles.coins`, and `coin_transactions` from 016/009. |

## Function Replacement Notes

Several migrations intentionally redefine RPCs with `CREATE OR REPLACE FUNCTION`. The final active versions after all migrations are:

- `submit_vote_and_get_results(p_question_id uuid, p_choice text, p_vote_time real default null)` from 012.
- `get_vote_history()` from 005.
- `get_or_create_profile()` from 018.
- `get_leaderboard()` from 018.
- `get_friends_list()` from 018.
- `get_friend_votes_for_question(p_question_id uuid)` from 018.
- `set_display_name(p_name text, p_cost int default 0)` from 019.
- `check_mystery_box_drop()` from 022.
- `submit_community_question(p_option_a text, p_option_b text, p_category text default 'community')` from 023.
- `add_friend_by_code(p_code text, p_is_premium boolean default false)` from 014, which delegates to `send_friend_request()`.

## Seed Data

Run seed files after migrations. The translation seed requires the translation columns from 005 and English question rows from `seed.sql` and `seed_v2.sql`.

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed_v2.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed_translations.sql
```

Seed file purposes:

- `supabase/seed.sql`: inserts the first 30 English questions dated `2026-02-05` through `2026-03-06`.
- `supabase/seed_v2.sql`: inserts questions 31-100 dated `2026-03-07` through `2026-05-15`.
- `supabase/seed_translations.sql`: updates Turkish translations for seeded English questions. Run this last.

For a live launch after May 15, 2026, update `scheduled_date` values before seeding so at least one active question is scheduled for launch day and future days. `questions.scheduled_date` was unique in 001 but becomes unique per `(scheduled_date, time_slot)` in 012.

## Post-Run Checks

Use these SQL checks after migration and seed:

```sql
select count(*) as questions from public.questions;
select scheduled_date, count(*) from public.questions group by scheduled_date order by scheduled_date limit 10;
select proname from pg_proc where proname in (
  'submit_vote_and_get_results',
  'get_or_create_profile',
  'get_leaderboard',
  'check_mystery_box_drop',
  'submit_community_question'
) order by proname;
```
