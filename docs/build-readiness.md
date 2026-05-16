# Build Readiness

## Ready

- TypeScript configuration is present and `npm run typecheck` maps to `tsc --noEmit`.
- Jest test setup and focused unit tests are present across components, hooks, constants, and library modules.
- App assets are present: icon, adaptive icon, splash icon, and favicon.
- Sound assets are present under `assets/sounds/`: vote, tick, and result sounds.
- Expo config is App Store oriented:
  - iOS bundle identifier is `com.splitsecond.app`.
  - Splash background color is `#0F0E17`, matching the dark theme.
  - `ios.supportsTablet` is `false`, which is appropriate for a portrait-only phone app.
  - EAS production build profile exists.

## Manual Steps

- Enroll in the Apple Developer Program ($99/year).
- Create the Split Second app record in App Store Connect.
- Generate or allow EAS to manage iOS distribution certificates and provisioning profiles.
- Update Expo SDK dependencies with network access. Current blocked item from `npx expo install --check`:
  - `react-native-pager-view@8.0.0` should be `6.9.1` for Expo SDK 54.
- Run the Supabase SQL migrations and seed data required for production:
  - `supabase/migrations/*.sql`
  - `supabase/seed.sql`
  - `supabase/seed_translations.sql`
  - `supabase/seed_v2.sql`
- Replace the placeholder Apple submit credentials in `eas.json`:
  - `TODO_REPLACE_WITH_APPLE_ID`
  - `TODO_REPLACE_WITH_ASC_APP_ID`

## Build And Submit

Run this chain after the manual steps are complete:

```sh
npm install
npx expo install react-native-pager-view
npx expo install --check
npx tsc --noEmit
npx eas login
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

## Notes

- `expo-dev-client` is not required for the production App Store build.
- The `development` EAS profile currently sets `developmentClient: true`; install `expo-dev-client` before using that profile.
- Attempted install command: `EXPO_NO_TELEMETRY=1 npx expo install expo-dev-client`.
- The install could not complete in this environment because npm registry network access is unavailable.
