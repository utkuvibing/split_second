# Split Second

**[Türkçe README](README.tr.md)**

A daily "Would You Rather?" mobile app built with React Native and Expo. Three questions per day at **08:00**, **14:00**, and **20:00** (device local time). Vote under a 10-second countdown, complete all three to keep your streak and earn rewards.

## Features

- **Three Daily Questions** — Morning (08:00), afternoon (14:00), and evening (20:00) dilemmas in your local timezone
- **10-Second Countdown** — Vote before time runs out on each question
- **Day Completion** — Answer all active questions today to complete the day, update your streak, and unlock mystery box eligibility
- **Live Results** — See the global vote split after casting yours
- **Streak Tracking** — Keep your daily voting streak alive
- **Leaderboard** — Most active players and longest streaks
- **Badge System** — 14+ badges for milestones, speed, and dedication
- **Personality Analysis** — Discover your decision-making style after enough votes
- **Theme Engine** — 6 visual themes to personalize the app
- **Cosmetic Shop** — Profile frames, vote effects, and more
- **Friends & Compatibility** — Add friends and see how your choices compare
- **Share Cards** — Generate and share your vote as an image
- **Deep Links** — Direct link to any day's question
- **i18n** — Turkish and English with automatic device locale detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo SDK 54](https://expo.dev/) (React Native) |
| Routing | [expo-router](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend | [Supabase](https://supabase.com/) (Postgres + Auth + RPC) |
| Animations | react-native-reanimated |
| State | React hooks |
| Testing | Jest + React Native Testing Library |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Expo Go](https://expo.dev/go) on your phone

### Setup

```bash
git clone https://github.com/utkuvibing/split_second.git
cd split_second
npm install --legacy-peer-deps
```

Copy `.env.example` to `.env` and fill in your own Supabase project credentials. Then run the SQL migrations from `supabase/migrations/` in order on your Supabase project.

**Do not commit `.env`.** Enable the push guard once per clone:

```bash
git config core.hooksPath .githooks
npm run secrets:check
```

See [docs/public-repo-security.md](docs/public-repo-security.md) before making the repo public.

### Run

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go on your phone.

## License

Private — All rights reserved.
