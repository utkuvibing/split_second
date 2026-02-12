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

## Supabase Error Handling
- When `supabase.rpc()` returns `{ error }`, it's ALWAYS a transport/server error (RPC missing, network, etc.)
- Validation errors from the RPC come in `data` (e.g. `{success: false, error: 'invalid_length'}`)
- Never map Supabase-level errors to user validation messages — they are server errors
- Supabase/PostgREST error for missing function is "Could not find the function..." NOT "does not exist"
