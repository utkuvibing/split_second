# Split Second

**[Türkçe README](README.tr.md)**

A daily "Would You Rather?" mobile app built with React Native and Expo. One question per day, vote under countdown pressure, and see how the world thinks.

## Features

- **Daily Question** — A new "would you rather" dilemma every day at midnight
- **Countdown Timer** — Vote before time runs out for a more intense experience
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

### Run

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go on your phone.

## License

Private — All rights reserved.
