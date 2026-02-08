# Split Second

**[Türkçe README](README.tr.md)**

A daily "Would You Rather?" mobile app built with React Native and Expo. One question per day, vote under pressure with a countdown timer, and see how the world thinks.

## Features

### Core
- **Daily Question** — A new "would you rather" question every day at midnight
- **Countdown Timer** — Vote before time runs out for a more intense experience
- **Live Results** — See the global vote split after casting yours
- **Streak Tracking** — Keep your daily voting streak alive
- **Global Stats** — See how many people voted today and overall trends
- **Leaderboard** — See the most active players and longest streaks
- **Badge System** — 14+ badges: first vote, streak milestones, speed demon, night owl, and more
- **Post-Vote Insights** — Statistical insights and next badge progress after voting

### Premium & Cosmetics
- **Theme Engine** — 6 themes: Midnight (default), Ocean, Sunset, Forest, Rose Gold, Noir
- **Cosmetic Shop** — Purchase and equip themes, profile frames, and vote effects
- **Premium Subscription** — Unlimited history, detailed stats, all badges, insights (Phase 1: dev stub)
- **Paywall** — Monthly/yearly plan selection (real payments via RevenueCat in Phase 2)
- **Dev Tools** — Premium simulation and own-all-cosmetics toggles (in __DEV__ mode)

### General
- **Share Cards** — Generate and share your vote as an image
- **Deep Links** — Share a direct link to any day's question (`split-second://q/2025-01-15`)
- **i18n** — Multi-language support with device locale detection (TR + EN)
- **Haptic Feedback & Sound Effects** — Tactile and audio feedback on interactions
- **Onboarding** — First-launch walkthrough for new users

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo SDK 54](https://expo.dev/) (React Native 0.81) |
| Routing | [expo-router](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend | [Supabase](https://supabase.com/) (Postgres + Auth + RPC) |
| Auth | Supabase anonymous auth |
| Animations | react-native-reanimated |
| State | React hooks (no external state library) |
| Testing | Jest 30 + React Native Testing Library |
| Linting | ESLint + TypeScript |

## Project Structure

```
split-second/
├── app/                    # File-based routing (expo-router)
│   ├── _layout.tsx         # Root layout (ThemeProvider, gesture handler, onboarding)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Home — daily question + voting
│   │   ├── profile.tsx     # Profile — stats, history, shop, badges
│   │   └── leaderboard.tsx # Leaderboard
│   └── q/[date].tsx        # Deep link route for specific dates
├── components/             # UI components (30+)
│   ├── Shop.tsx            # Cosmetic shop modal
│   ├── Paywall.tsx         # Premium paywall modal
│   ├── DevMenu.tsx         # Dev tools (__DEV__)
│   └── ...                 # QuestionCard, ResultBar, BadgeGrid, etc.
├── hooks/                  # Custom React hooks (12)
│   ├── usePremium.ts       # Premium state management
│   ├── useCosmetics.ts     # Cosmetics ownership & equipping
│   └── ...                 # useAuth, useVote, useBadges, etc.
├── lib/                    # Business logic & utilities (19 modules)
│   ├── themes.ts           # 6 theme color definitions
│   ├── themeContext.tsx     # ThemeProvider + useTheme hook
│   ├── premium.ts          # Premium check utilities
│   ├── cosmetics.ts        # Frame & effect catalog
│   └── ...                 # supabase, badges, i18n, share, etc.
├── constants/              # Typography tokens
├── types/                  # TypeScript type definitions
├── __mocks__/              # Jest mocks for Expo & RN modules
├── supabase/
│   ├── migrations/         # SQL migrations (run in order)
│   └── seed.sql            # Sample question data
├── tasks/                  # Dev notes, plans, validation reports
└── assets/sounds/          # Sound effect files (add manually)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Expo Go](https://expo.dev/go) app on your phone (for development)

### 1. Clone & Install

```bash
git clone https://github.com/utkuvibing/split_second.git
cd split_second
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note**: Create your own Supabase project and enter your URL and anon key here. Run the migration files in `supabase/migrations/` in order to set up the database schema. You can also use `.env.example` as a reference.

### 3. Sound Files (Optional)

Add short sound effects to `assets/sounds/`:
- `tick.mp3` — timer countdown tick
- `vote.mp3` — vote tap feedback
- `result.mp3` — results reveal

The app works fine without them — sounds fail silently.

### 4. Run

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go on your phone.

### Supabase Migrations (Admin Only)

If you need to set up a fresh Supabase project, run the migrations **in order** in the SQL editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_streaks.sql
supabase/migrations/003_history_stats.sql
supabase/migrations/004_global_stats.sql
supabase/migrations/005_question_translations.sql
supabase/migrations/008_premium.sql
```

Then seed with sample questions:

```sql
-- Run in Supabase SQL editor
supabase/seed.sql
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run typecheck` | TypeScript type checking |

## Database Architecture

The app uses Supabase with **atomic RPC functions** for all write operations — vote submission, result calculation, and streak updates happen in a single database call to prevent race conditions.

**Tables**: `questions`, `votes`, `user_streaks`, `user_profiles`, `user_cosmetics`, `user_equipped`
**Views**: `question_results` (aggregated vote percentages)
**RPCs**:
- `submit_vote_and_get_results()` — atomic vote + results + streak update
- `get_or_create_profile()` — create/fetch premium profile
- `get_user_cosmetics()` — fetch owned cosmetics
- `purchase_cosmetic()` — purchase a cosmetic item
- `equip_cosmetic()` — equip/unequip a cosmetic

Row Level Security (RLS) is enabled on all tables. Anonymous auth ensures each device gets a unique user ID.

## License

Private — All rights reserved.
