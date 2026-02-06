# Split Second

A daily "Would You Rather?" mobile app built with React Native and Expo. One question per day, vote under pressure with a countdown timer, and see how the world thinks.

## Features

- **Daily Question** — A new "would you rather" question every day at midnight
- **Countdown Timer** — Vote before time runs out for a more intense experience
- **Live Results** — See the global vote split after casting yours
- **Streak Tracking** — Keep your daily voting streak alive
- **Global Stats** — See how many people voted today and overall trends
- **Share Cards** — Generate and share your vote as an image
- **Deep Links** — Share a direct link to any day's question (`split-second://q/2025-01-15`)
- **i18n** — Multi-language support with device locale detection
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
│   ├── _layout.tsx         # Root layout (gesture handler, error boundary, onboarding)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Home — daily question + voting
│   │   └── profile.tsx     # Profile — stats, history, streaks
│   └── q/[date].tsx        # Deep link route for specific dates
├── components/             # UI components (17)
├── hooks/                  # Custom React hooks (10)
├── lib/                    # Business logic & utilities (15 modules)
├── constants/              # Colors, typography tokens
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
git clone https://github.com/imgevio/split_second.git
cd split_second
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://rsfxbqfvunmzjdwkmyit.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZnhicWZ2dW5tempkd2tteWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTQ1MDksImV4cCI6MjA4NTg5MDUwOX0.ozK8b0thPmLDvOrBdSOYY_WfFa4ET59l-o0CgqcfaqU
```

> **Note**: These are the shared test environment credentials. The anon key is a public client-side key — all data is protected by Row Level Security (RLS) on the database. Do NOT use these in production.

### 3. Sound Files (Optional)

Add short sound effects to `assets/sounds/`:
- `tick.mp3` — timer countdown tick
- `vote.mp3` — vote tap feedback
- `result.mp3` — results reveal

The app works fine without them — sounds fail silently.

### 4. Run

```bash
npx expo start
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

**Tables**: `questions`, `votes`, `user_streaks`
**Views**: `question_results` (aggregated vote percentages)
**RPC**: `submit_vote_and_get_results()` — atomic vote + results + streak update

Row Level Security (RLS) is enabled on all tables. Anonymous auth ensures each device gets a unique user ID.

## License

Private — All rights reserved.
