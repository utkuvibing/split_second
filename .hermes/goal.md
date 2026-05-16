# Split Second — Launch Goal

**Mission:** Split Second uygulamasını App Store'da yayına almak.

## State
- ✅ Code complete (V16: avatars, compatibility, matching tab, all features done)
- ✅ 301 tests passing, TypeScript 0 errors
- ❌ SQL migrations not run in Supabase yet
- ❌ Sound files missing (tick.mp3, vote.mp3, result.mp3)
- ❌ App icon + splash screen assets needed
- ❌ EAS not configured/built
- ❌ Not deployed

## Execution Plan

### Step 1: Assets
- Generate app icon (1024x1024 PNG, dark theme)
- Generate splash screen
- Add free CC0 sound effects
- Update app.json with proper config

### Step 2: Supabase Setup
- Create a step-by-step migration runbook
- Test Supabase connection
- Prepare seed data

### Step 3: Build
- EAS configure
- iOS production build
- TestFlight upload

### Step 4: App Store
- Screenshots
- Description/metadata
- Submit for review

## Decisions
- Distribution: App Store (iOS only first, Android later)
- Monetization: Free + Premium subscription + Coin shop
- Language: Türkçe + English (i18n)
