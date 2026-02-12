# Split Second - Task Tracker

## Phase 1: Foundation (MVP - Completed)
- [x] Create Expo project with TypeScript template
- [x] Install dependencies (supabase-js, async-storage, reanimated, url-polyfill)
- [x] Install expo-router + peer dependencies
- [x] Configure app.json (dark theme, bundleIdentifier, reanimated plugin)
- [x] Create .env with Supabase placeholders
- [x] Create lib/supabase.ts with AsyncStorage config

## Phase 2: Database (MVP - Completed)
- [x] Create migration SQL (tables, indexes, RLS, RPC, view)
- [x] Create seed.sql with 30 questions
- [x] Run migration in Supabase Dashboard (manual step)
- [x] Enable anonymous auth in Supabase Dashboard (manual step)
- [x] Run seed in Supabase Dashboard (manual step)

## Phase 3: Data Layer (MVP - Completed)
- [x] Create types/database.ts
- [x] Create lib/auth.ts (anonymous auth)
- [x] Create lib/questions.ts (getTodayQuestion)
- [x] Create lib/votes.ts (submitVote, getUserVote, getResults)
- [x] Create hooks: useAuth, useTodayQuestion, useVote
- [x] Create hooks: useCountdownTimer, useDailyCountdown

## Phase 4: UI - Question Screen (MVP - Completed)
- [x] Create constants/colors.ts and constants/typography.ts
- [x] Create LoadingScreen component
- [x] Create QuestionCard with animated buttons
- [x] Create CountdownTimer (10-sec)
- [x] Wire up app/index.tsx with all states
- [x] Create app/_layout.tsx with auth + splash

## Phase 5: UI - Results (MVP - Completed)
- [x] Create ResultBars with animated bar + percentage count-up
- [x] Create DailyCountdown (next question countdown)
- [x] Create NoQuestion component
- [x] Handle all app states (loading, error, no question, voting, results)
- [x] Staggered animations (option B 200ms delay)

## Phase 6: Polish & Config (MVP - Completed)
- [x] Error handling with retry button
- [x] eas.json configuration
- [x] .gitignore updated
- [x] TypeScript compiles cleanly (0 errors)

---

## NEW FEATURES (V2 - Implemented)

### Phase 1: Quick Wins
- [x] 1A. Social Proof Messages - SocialProofBadge in ResultBar.tsx
- [x] 1B. Share Button - lib/share.ts + components/ShareButton.tsx
- [x] 1C. Haptic Feedback - expo-haptics + lib/haptics.ts
- [x] 1D. Category Insight Messages - lib/insights.ts + CategoryInsight

### Phase 2: Navigation + History + Streak
- [x] 2A. Tab Navigation - app/(tabs)/ structure, "Bugun" + "Profil" tabs
- [x] 2B. Streak System - 002_streaks.sql, lib/streaks.ts, StreakBadge.tsx
- [x] 2C. Vote History - 003_history_stats.sql, lib/history.ts, HistoryCard.tsx
- [x] 2D. Profile & Stats - lib/stats.ts, StatsGrid.tsx, StatCard.tsx

### Phase 3: Viral Growth
- [x] 3A. Deep Link Challenge - app/q/[date].tsx, lib/deeplink.ts, ChallengeButton.tsx
- [x] 3B. Visual Share Card - ShareCard.tsx, react-native-view-shot, expo-sharing
- [x] 3C. Global Social Proof - 004_global_stats.sql, GlobalStatsBanner.tsx

### Phase 4: UI/UX Polish
- [x] 4A. Onboarding - Onboarding.tsx, useOnboarding.ts (2 screens)
- [x] 4B. Swipe Voting - react-native-gesture-handler, PanGesture in QuestionCard
- [x] 4C. Enhanced Animations - Confetti.tsx, timer pulse animation
- [x] 4D. Sound Effects - expo-av, lib/sounds.ts (needs .mp3 files)

### Phase 5: Content & Retention
- [x] 5A. Push Notifications - expo-notifications, lib/notifications.ts
- [x] 5B. More Questions - seed_v2.sql (70 new questions through May 15)

---

## Manual Deployment Steps
- [ ] Run 002_streaks.sql in Supabase SQL Editor
- [ ] Run 003_history_stats.sql in Supabase SQL Editor
- [ ] Run 004_global_stats.sql in Supabase SQL Editor
- [ ] Run seed_v2.sql in Supabase SQL Editor
- [ ] Run 005_question_translations.sql in Supabase SQL Editor
- [ ] Run seed_translations.sql in Supabase SQL Editor
- [ ] Add sound files: assets/sounds/tick.mp3, vote.mp3, result.mp3
- [ ] Test with `npx expo start --tunnel` on iPhone
- [ ] Create app icon + splash screen
- [ ] `eas login` + `eas build:configure`
- [ ] Build for iOS: `eas build --platform ios --profile production`
- [ ] Submit to TestFlight: `eas submit --platform ios`

## Review
- All code TypeScript-strict compliant (0 errors)
- Tab navigation with "Bugun" and "Profil" tabs
- Streak system with milestone celebrations (confetti)
- Full profile with stats grid + vote history
- Social proof, category insights after voting
- Share (text + image), challenge friend via deep link
- Swipe voting (Tinder-style) + button tap
- Pulse animation on timer last 3 seconds
- Haptic feedback on vote, result, and countdown
- Onboarding flow for first-time users
- Push notifications (daily reminder + streak warning)
- 100 total questions (30 original + 70 new)

### Phase 6: i18n + Tab Polish (V3)
- [x] 6A. i18n System - lib/i18n.ts with TR/EN, auto-detect device language (expo-localization)
- [x] 6B. Fix Turkish Characters - All ö,ü,ş,ç,ğ,ı,İ corrected across all files
- [x] 6C. Swipeable Tabs - @react-navigation/material-top-tabs, smooth swipe between Bugün/Profil
- [x] 6D. All components updated to use t() function from lib/i18n.ts

### Phase 7: Engagement & Retention (V4)
- [x] 7A. Badge System - 006_badges.sql, lib/badges.ts, hooks/useBadges.ts
  - 14 badges (First Vote, Speed Demon, Night Owl, Streak 3-100, Conformist, Rebel, Explorer, Dedicated, Veteran)
  - BadgeCard.tsx, BadgeGrid.tsx, BadgeUnlockToast.tsx components
  - Badge unlock detection after each vote with animated toast
  - Progress tracking for locked badges
- [x] 7B. Post-Vote Experience - PostVoteInsights.tsx, lib/insights.ts (getQuestionInsight)
  - Question insights: Controversial/Clear favorite/Popular labels
  - Next badge progress display after voting
  - Results view now scrollable for more content
- [x] 7C. Leaderboard Tab - 007_leaderboard.sql, lib/leaderboard.ts, hooks/useLeaderboard.ts
  - 3-tab layout: Today | Leaderboard | Profile
  - Top 50 users ranked by current streak
  - Anonymous naming (Player #XXXX from user_id hash)
  - Top 3 emoji medals, current user highlighted
  - Pull-to-refresh, user's own rank always visible
- [x] 7D. i18n - All new strings translated (TR/EN)
  - Badge names/descriptions, insights, leaderboard labels

---

### Manual Steps for V4
- [ ] Run 006_badges.sql in Supabase SQL Editor
- [ ] Run 007_leaderboard.sql in Supabase SQL Editor

---

### Phase 9: Coin Economy + Shop UX (V6)
- [x] 9A. Coin Backend - 009_coins.sql
  - coins column on user_profiles, coin_transactions table
  - Updated submit_vote_and_get_results: +10 coin per daily vote, streak bonuses (+5/+15/+25/+50)
  - purchase_cosmetic_with_coins RPC (atomic, coin check, deduct, log)
  - get_coin_balance, award_badge_coins, award_share_coins RPCs
  - Updated get_or_create_profile to include coins
- [x] 9B. Coin Frontend - lib/coins.ts, hooks/useCoins.ts
  - Price definitions: themes 150-200, frames 100-120, effects 100
  - Reward definitions: vote 10, streak 5-50, badge 20, share 5
  - useCoins hook: fetch/spend/awardBadge/awardShare
  - useVote updated: returns coinsEarned from RPC response
  - useCosmetics updated: coin-based purchase method
  - usePremium updated: exposes coins from profile
- [x] 9C. Shop Grid Fix
  - ShopItem: explicit width, bigger preview (64px), proper fonts (14/11), coin prices
  - Shop: proper width calc (screenWidth - padding*2 - gap) / 2
  - Shop: coin balance badge in header (gold border)
  - ThemePreview: enlarged to 56px, added surface bar mockup
- [x] 9D. Preview System
  - FramePreview.tsx: gradient border circle (half-color simulation)
  - EffectPreview.tsx: animated confetti/lightning/hearts/swipe loops
  - ItemPreviewModal.tsx: full modal with large previews, buy/equip, price
- [x] 9E. Coin UI
  - Profile header: coin balance badge
  - Vote results: "+X coins!" animated toast
  - Streak bonuses: "+X coins! (streak bonus)" label
  - 11 new i18n keys (TR + EN)
- [x] 9F. Premium → Coin Transition
  - Shop no longer gates cosmetics behind premium
  - Coin-based purchasing replaces premium requirement
  - Premium kept for ad-free, detailed stats, unlimited history

### Manual Steps for V6
- [ ] Run 009_coins.sql in Supabase SQL Editor

---

### Phase 10: Cosmetic Visibility (V7)
- [x] 10A. ProfileCard - components/ProfileCard.tsx (NEW)
  - Avatar circle with equipped frame border (gradient simulation)
  - Anonymous player name (Player #XXXX from userId hash)
  - Streak badge + coin balance below avatar
  - No frame → simple thin border, frame → 2-color gradient border
- [x] 10B. ProfileCard Integration - app/(tabs)/profile.tsx
  - Added useAuth import for userId
  - Added ProfileCard above stats section with frameId, streak, coins, userId
- [x] 10C. Leaderboard Frame - components/Leaderboard.tsx
  - Import usePremium, pass equippedFrame as frameId to current user's LeaderboardRow
  - Both in-list and footer rows receive frameId prop
- [x] 10D. Vote Effect - components/VoteEffect.tsx (NEW)
  - Full-screen one-shot effects: confetti, lightning (yellow flash), hearts (rising)
  - pointerEvents="none", auto-fades after ~2 seconds
- [x] 10E. Vote Effect Integration - app/(tabs)/index.tsx
  - equippedEffect from usePremium controls effect display
  - Equipped effect shown on every vote, streak confetti as fallback
- [x] 10F. i18n - profileAnonymous key added (TR: Oyuncu, EN: Player)
- [x] 10G. TypeScript - 0 errors confirmed

---

### Phase 11: Engagement Hooks - Personality + Friends (V8)

#### Feature 1: Personality Profile
- [x] 11A. DB Migration - 010_personality.sql
  - vote_time_seconds column on votes table
  - user_personality table (type, 4 axis scores, votes_analyzed)
  - get_personality_context() RPC - raw data for client calculation
  - save_personality() RPC - persist calculated profile
  - Updated submit_vote_and_get_results with p_vote_time parameter
- [x] 11B. Personality Engine - lib/personality.ts
  - 4 axes: Conformity, Speed, Diversity, Courage (0-100 each)
  - 8 personality types with weighted scoring algorithm
  - Flash Rebel, Cool Strategist, Gut Feeler, Lone Wolf
  - Explorer Soul, Specialist Sage, Chaos Agent, Wise Owl
- [x] 11C. Vote Time Tracking - lib/votes.ts + hooks/useVote.ts
  - submitVote now passes voteTimeSeconds to RPC
  - DB records vote duration for speed axis calculation
- [x] 11D. Personality Hook - hooks/usePersonality.ts
  - Load existing personality or calculate on first unlock (7 votes)
  - isFirstReveal flag for trigger modal
  - recalculate() method updates on each vote
- [x] 11E. Personality UI Components
  - PersonalityProgress.tsx - Pre-unlock progress bar (X/7 votes)
  - PersonalityBadge.tsx - Inline emoji + type name badge
  - PersonalityDetailCard.tsx - 4 axis bars (premium-gated)
  - PersonalityRevealModal.tsx - Animated reveal (analyze → zoom emoji → title → description)
  - PersonalityShareCard.tsx - Shareable card with axes
- [x] 11F. Personality Integration
  - ProfileCard: personality badge below player name
  - profile.tsx: personality section (detail card or progress bar)
  - index.tsx: 7th vote triggers PersonalityRevealModal

#### Feature 2: Friend Code System
- [x] 11G. DB Migration - 011_friends.sql
  - friend_code column on user_profiles (auto-generated 6-char, no O/0/I/1/L)
  - friendships table (bidirectional, unique constraint)
  - Updated get_or_create_profile: auto-assigns friend_code
  - add_friend_by_code RPC (limit check, self check, dupe check)
  - get_friends_list RPC (with compatibility score)
  - get_friend_votes_for_question RPC
  - remove_friend RPC (both directions)
- [x] 11H. Friends API - lib/friends.ts + hooks
  - All friend operations wrapped in typed functions
  - useFriends hook: list, add, remove, refetch
  - useFriendVotes hook: post-vote friend choices
  - Compatibility score labels (5 tiers: 0-20% to 81-100%)
- [x] 11I. Friend UI Components
  - FriendCodeCard.tsx - Code display + copy + share
  - AddFriendModal.tsx - 6-digit PIN-style input with error handling
  - FriendsList.tsx - Friend rows with compatibility badge, long-press remove
  - CompatibilityBadge.tsx - Score + label display
  - FriendVotesFeed.tsx - Post-vote "friends' choices" feed
- [x] 11J. Friend Integration
  - profile.tsx: friend code card + friends list + add modal
  - index.tsx: FriendVotesFeed in post-vote results
  - premium.ts: FREE_FRIEND_LIMIT = 3, unlimitedFriends feature flag
  - usePremium.ts: exposes friendCode from profile
  - types/premium.ts: friend_code field on UserProfile
- [x] 11K. i18n - 50+ new translation keys (TR + EN)
  - Personality: 8 type names + descriptions, axis labels, UI strings
  - Friends: code, add/remove, compatibility tiers, feed labels
- [x] 11L. TypeScript - 0 errors confirmed

### Manual Steps for V8
- [ ] Run 010_personality.sql in Supabase SQL Editor
- [ ] Run 011_friends.sql in Supabase SQL Editor
- [ ] Install expo-clipboard: `npx expo install expo-clipboard`

## Phase 12: Motivation Package (Multi-Question System)

### Phase 12.1: Database Migration
- [x] 012_multiple_questions.sql - time_slot column, composite unique constraint
- [x] Updated submit_vote_and_get_results RPC: 5 coins/vote, streak on 3/3 completion

### Phase 12.2: Client Data Layer
- [x] types/database.ts - Added TimeSlot type, time_slot to Question, votes_today/all_today_voted to VoteResults
- [x] lib/questions.ts - getTodayQuestions() (array), isQuestionUnlocked(), getSecondsUntilUnlock()
- [x] hooks/useTodayQuestions.ts - New hook replacing useTodayQuestion
- [x] hooks/useCountdownToUnlock.ts - Per-slot countdown timer

### Phase 12.3: Carousel UI
- [x] components/QuestionCarousel.tsx - FlatList horizontal paging with pagination dots
- [x] components/LockedQuestionCard.tsx - Lock icon + countdown for locked slots
- [x] app/(tabs)/index.tsx - Major refactor: multi-question state, carousel, day-complete view

### Phase 12.4: Supporting Changes
- [x] lib/personality.ts - PERSONALITY_UNLOCK_VOTES 7 → 6
- [x] lib/coins.ts - COIN_REWARDS.daily_vote → question_vote (5), added day_complete (5)
- [x] lib/notifications.ts - 3 time slot notifications (08:00, 14:00, 20:00)
- [x] hooks/useDailyCountdown.ts - Next question unlock or midnight countdown
- [x] components/DailyCountdown.tsx - Dynamic label based on countdown type
- [x] lib/deeplink.ts - Added slot param support
- [x] app/q/[date].tsx - Added ?slot= query param for deep links
- [x] lib/i18n.ts - 20+ new keys (TR + EN): multi-question, notifications, onboarding, social

### Phase 12.5: Onboarding
- [x] components/Onboarding.tsx - 4 slides (was 2): questions, world, personality, friends

### Phase 12.6: Social Layer
- [x] components/FriendVotesFeed.tsx - Bigger card layout with reaction badges
- [x] app/(tabs)/leaderboard.tsx - Global/Friends tab with actual friend filtering
- [x] lib/leaderboard.ts - Added fetchFriendLeaderboard() with client-side filtering
- [x] hooks/useLeaderboard.ts - Tab parameter support (global/friends)
- [x] lib/i18n.ts - Added leaderboardFriendRank key (TR + EN)

### Phase 12.7: Tests
- [x] Updated lib/__tests__/questions.test.ts for getTodayQuestions + unlock tests
- [x] Updated hooks/__tests__/useTodayQuestion.test.ts with time_slot mock data
- [x] Updated hooks/__tests__/useVote.test.ts for vote_time arg
- [x] Updated lib/__tests__/votes.test.ts for p_vote_time param
- [x] NEW hooks/__tests__/useTodayQuestions.test.ts - 7 tests for multi-question hook
- [x] All 288 tests passing, TypeScript clean

### Manual Steps for V12
- [ ] Run 012_multiple_questions.sql in Supabase SQL Editor
- [ ] Seed 3 questions per day (morning/afternoon/evening time_slot) instead of 1
- [ ] Test carousel swipe on real device

---

## Phase 13: UI Modernization (V13)

### Phase 13.1: Foundation
- [x] constants/ui.ts - Design tokens (RADIUS, SHADOW, GLASS, GRADIENT, SPRING)
- [x] components/ui/GlassCard.tsx - Glassmorphism wrapper (BlurView + fallback)
- [x] components/ui/GradientButton.tsx - LinearGradient CTA with spring animation
- [x] components/ui/AnimatedIcon.tsx - Animated Ionicons/MCI with pulse/bounce
- [x] lib/haptics.ts - hapticButton(), hapticError(), hapticStreak() functions
- [x] constants/typography.ts - letterSpacing + textShadow enhancements

### Phase 13.2: Tab Bar
- [x] app/(tabs)/_layout.tsx - Ionicons replacing emoji Text, SHADOW.sm, frosted bg

### Phase 13.3: Core Components
- [x] QuestionCard.tsx - SHADOW.md, SPRING.button, hapticButton, RADIUS.lg, letterSpacing
- [x] ResultBar.tsx - Ionicons (hand-left, flame, checkmark-circle), withSpring, SHADOW.sm
- [x] CountdownTimer.tsx - Glass container, Typography.timer, SHADOW.sm
- [x] QuestionCarousel.tsx - Gradient pagination dots, glass progress pill
- [x] LockedQuestionCard.tsx - GlassCard + AnimatedIcon lock pulse
- [x] ProfileCard.tsx - GlassCard, Ionicons person, MCI fire
- [x] StreakBadge.tsx - AnimatedIcon fire (pulse streak>7)
- [x] StatCard.tsx - Icon support + SHADOW.sm + RADIUS.lg
- [x] StatsGrid.tsx - All emojis → icons
- [x] ShareCard.tsx - SHADOW.lg, letterSpacing brand text
- [x] BadgeUnlockToast.tsx - GlassCard + accent glow
- [x] FriendVotesFeed.tsx - GLASS bg + SHADOW.sm
- [x] PersonalityDetailCard.tsx - GlassCard + SHADOW.sm
- [x] DailyCountdown.tsx - GLASS background + border

### Phase 13.4: Screens
- [x] index.tsx - Ionicons, GradientButton, GlassCard wrappers
- [x] profile.tsx - GlassCard coin badge, GradientButton shop, icons
- [x] leaderboard.tsx - GlassCard tab toggle, SHADOW.sm rank banner
- [x] q/[date].tsx - Ionicons link, GradientButton home/retry

### Phase 13.5: Secondary Components
- [x] Onboarding.tsx - AnimatedIcon slides, GradientButton, gradient dot
- [x] LeaderboardRow.tsx - MCI fire, RADIUS.lg + SHADOW.sm
- [x] Leaderboard.tsx - AnimatedIcon trophy bounce
- [x] FriendsList.tsx - Ionicons, GradientButton
- [x] FriendCodeCard.tsx - GlassCard, Ionicons clipboard
- [x] Shop.tsx - Ionicons close
- [x] Paywall.tsx - Ionicons close/flash/checkmark, GradientButton
- [x] PremiumFeaturesCard.tsx - Ionicons/MCI feature icons, GradientButton
- [x] PersonalityProgress.tsx - AnimatedIcon crystal-ball pulse
- [x] PersonalityRevealModal.tsx - AnimatedIcon + GradientButton
- [x] PostVoteInsights.tsx - Ionicons lock-closed
- [x] PremiumGate.tsx - Ionicons lock-closed
- [x] NoQuestion.tsx - AnimatedIcon hourglass pulse
- [x] GlobalStatsBanner.tsx - GLASS background
- [x] BadgeGrid.tsx - Ionicons lock-closed

### Phase 13.6: Tests & Verification
- [x] jest.setup.js - Mocks for @expo/vector-icons, expo-linear-gradient, expo-blur, react-native-reanimated
- [x] NoQuestion.test.tsx - Updated emoji assertion → icon assertion
- [x] All 32 suites, 288 tests passing
- [x] TypeScript: 0 errors
- [x] Expo Metro Bundler starts successfully

---

## Bug Fixes + Community Coin Cost (V14)

### Bug Fix 1: UTC Timezone
- [x] lib/questions.ts - `toISOString()` → local date formatting (fixes UTC+3 midnight issue)

### Bug Fix 2: Nickname Error Messages
- [x] lib/nickname.ts - Distinguish RPC missing (`server_error`) vs validation (`invalid_length`)
- [x] components/NicknameEditModal.tsx - Show "sunucu hatası" for server errors
- [x] lib/i18n.ts - Added `nicknameServerError` key (TR + EN)

### Feature: Community Question Coin Cost (50 coins)
- [x] supabase/migrations/016_community_questions.sql - Coin balance check + deduct + transaction log in `submit_community_question` RPC
- [x] lib/coins.ts - Added `COIN_COSTS.submit_question = 50`
- [x] components/SubmitQuestionModal.tsx - `userCoins` prop, cost label, disabled when insufficient
- [x] hooks/useSubmitQuestion.ts - Handles `insufficient_coins` error code
- [x] app/(tabs)/community.tsx - useCoins integration, passes coins to modal, refreshes after submit
- [x] lib/i18n.ts - Added `communitySubmitCost`, `communityInsufficientCoins` keys (TR + EN)
- [x] TypeScript: 0 errors

### Manual Steps
- [ ] Run 013_nicknames.sql in Supabase SQL Editor (nick kaydetme için gerekli!)
- [ ] Update `submit_community_question` RPC in Supabase (re-run 016 or ALTER)

---

## Phase 15: Avatar System + Dev Coin Boost (V15)

### Avatar System
- [x] 018_avatars.sql - avatar_id column, set_avatar RPC, dev_add_coins RPC
  - Updated get_or_create_profile: returns avatar_id
  - Updated get_leaderboard: returns avatar_id per entry
  - Updated get_friends_list: returns friend_avatar_id
  - Updated get_friend_votes_for_question: returns friend_avatar_id
- [x] lib/avatars.ts - 28 emoji avatars in 4 categories (animals, people, objects, nature)
- [x] lib/avatar.ts - setAvatar() RPC wrapper
- [x] types/premium.ts - avatar_id field on UserProfile
- [x] hooks/usePremium.ts - avatarId state + return
- [x] components/AvatarDisplay.tsx - Reusable avatar+frame renderer (emoji or person icon)
- [x] components/ProfileCard.tsx - Refactored to use AvatarDisplay, added onEditAvatar prop
- [x] components/AvatarPickerModal.tsx - Category tabs, 4-column grid, save to DB
- [x] app/(tabs)/profile.tsx - AvatarPickerModal wired up
- [x] lib/leaderboard.ts - avatar_id field on LeaderboardEntry
- [x] lib/friends.ts - friend_avatar_id on Friend + FriendVote interfaces
- [x] components/LeaderboardRow.tsx - 28px avatar next to rank
- [x] components/FriendsList.tsx - 28px avatar next to friend name
- [x] components/FriendVotesFeed.tsx - 24px avatar in card header
- [x] lib/i18n.ts - 7 new keys (TR + EN): chooseAvatar, avatarSaved, categories, avatarNone

### Dev Menu Coin Boost
- [x] components/DevMenu.tsx - Premium toggle adds +9999 coins via dev_add_coins RPC
- [x] TypeScript: 0 errors

### Manual Steps
- [ ] Run 018_avatars.sql in Supabase SQL Editor

---

## Phase 16: Compatibility Matching + Badge Showcase (V16)

### Phase 16.1: Database
- [x] 021_friend_personalities.sql - get_friends_with_personality() RPC
  - Fetches friends with their personality axes (conformity, speed, diversity, courage)
  - Joins friendships → user_profiles → user_personality
  - Returns JSON array with friend_id, friend_code, display_name, avatar_id, axes

### Phase 16.2: Compatibility Engine
- [x] lib/compatibility.ts - Client-side compatibility calculation
  - 4-axis weighted similarity (conformity 0.3, speed 0.2, diversity 0.25, courage 0.25)
  - Complementary bonus for large courage/speed differences
  - 5 labels: soulmate (85+), veryCompatible (70+), compatible (50+), different (30+), opposite
  - Common ground & differences analysis per axis
- [x] hooks/useCompatibility.ts - Fetch friends + calculate compatibility
  - Calls get_friends_with_personality RPC
  - Sorts by compatibility score descending
  - Tracks bestMatch (highest scoring friend)

### Phase 16.3: Matching Tab UI
- [x] app/(tabs)/matching.tsx - New matching screen
  - Empty states: no personality yet, no friends
  - BestMatchBanner at top + CompatibilityCard list
- [x] components/BestMatchBanner.tsx - Gradient banner for best match
  - Avatar, name, score badge, soulmate highlight
- [x] components/CompatibilityCard.tsx - Per-friend compatibility card
  - 4-axis similarity bars with color coding
  - Common ground & differences text
  - Handles friends without personality (italic message)

### Phase 16.4: Badge Showcase
- [x] components/BadgeBannerStrip.tsx - Horizontal scrolling badge strip
  - FlatList horizontal, sorted by most recent unlock
  - GlassCard with accent border, emoji, title, date
- [x] components/ProfileCard.tsx - Added BadgeShowcaseRow (max 6 emoji badges)
- [x] app/(tabs)/profile.tsx - BadgeBannerStrip below ProfileCard

### Phase 16.5: Tab Navigation
- [x] app/(tabs)/_layout.tsx - 5 tabs: Leaderboard | Eşleşme | Bugün | Topluluk | Profil
  - initialRouteName="index" (app opens on Bugün)
  - Font size reduced to 10 for 5-tab fit
  - Heart icon for matching tab

### Phase 16.6: i18n
- [x] lib/i18n.ts - 20+ new keys (TR + EN)
  - Tab, matching, compatibility labels, empty states
  - Badge showcase, soulmate, common ground, differences

### Phase 16.7: Tests & Verification
- [x] lib/__tests__/compatibility.test.ts - 13 tests
  - calculateCompatibility: identical, opposite, per-axis, common ground, differences, complementary bonus, clamping, labels
  - getCompatibilityLabelKey: all 5 labels
- [x] All 33 suites, 301 tests passing
- [x] TypeScript: 0 errors

### Manual Steps for V16
- [ ] Run 021_friend_personalities.sql in Supabase SQL Editor
