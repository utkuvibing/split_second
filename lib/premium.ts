import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_PREMIUM_KEY = 'dev_premium_enabled';
const DEV_OWN_ALL_KEY = 'dev_own_all_cosmetics';

// Feature flags for premium gating
export const PREMIUM_FEATURES = {
  unlimitedHistory: 'unlimitedHistory',
  detailedStats: 'detailedStats',
  allBadges: 'allBadges',
  postVoteInsights: 'postVoteInsights',
  cosmetics: 'cosmetics',
  noAds: 'noAds',
  unlimitedFriends: 'unlimitedFriends',
  personalityDetail: 'personalityDetail',
} as const;

// Free tier friend limit
export const FREE_FRIEND_LIMIT = 3;

// Free tier limits
export const FREE_HISTORY_DAYS = 7;
export const FREE_BADGE_IDS = [
  'first_vote', 'speed_demon', 'night_owl',
  'streak_3', 'streak_7', 'streak_14',
  'conformist', 'rebel', 'explorer',
  'dedicated', 'veteran',
  'streak_30', 'streak_50', 'century',
];

// Premium-only badge IDs
export const PREMIUM_BADGE_IDS = ['collector', 'fashionista', 'supporter', 'completionist'];

/** Dev mode: check if premium is simulated */
export async function getDevPremium(): Promise<boolean> {
  if (!__DEV__) return false;
  const val = await AsyncStorage.getItem(DEV_PREMIUM_KEY);
  return val === 'true';
}

/** Dev mode: toggle premium simulation */
export async function setDevPremium(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(DEV_PREMIUM_KEY, String(enabled));
}

/** Dev mode: check if all cosmetics are owned */
export async function getDevOwnAll(): Promise<boolean> {
  if (!__DEV__) return false;
  const val = await AsyncStorage.getItem(DEV_OWN_ALL_KEY);
  return val === 'true';
}

/** Dev mode: toggle own-all cosmetics */
export async function setDevOwnAll(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(DEV_OWN_ALL_KEY, String(enabled));
}

/** Dev mode: reset all premium state */
export async function resetDevPremium(): Promise<void> {
  await AsyncStorage.multiRemove([DEV_PREMIUM_KEY, DEV_OWN_ALL_KEY]);
}

/** Check if a badge ID is premium-only */
export function isPremiumBadge(badgeId: string): boolean {
  return PREMIUM_BADGE_IDS.includes(badgeId);
}
