# Split Second - Lessons Learned

## Dependency Management
- Expo SDK 54 + React 19.1 can have peer dep conflicts. Use `--legacy-peer-deps` when `npx expo install` fails.
- `react-native-reanimated` v4 does NOT export `useEffect` or `SharedValue` type directly. Use React's `useEffect` and avoid typing SharedValue explicitly.
- `react-native-safe-area-context` and `react-native-screens` are required by expo-router but not auto-installed.

## Expo Router
- Must change `index.ts` entry to `import 'expo-router/entry'` when migrating from blank template.
- `app/` directory must exist for file-based routing.
- Old `App.tsx` must be removed to avoid conflicts.

## Reanimated v4
- No babel plugin needed - uses app.json plugin config instead.
- Percentage-width animations work with template literals in `useAnimatedStyle`.
