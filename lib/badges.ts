import { supabase } from './supabase';

export interface BadgeDef {
  id: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  check: (ctx: BadgeContext) => boolean;
  progress?: (ctx: BadgeContext) => { current: number; target: number } | null;
  isPremium?: boolean;
}

export interface BadgeContext {
  total_votes: number;
  majority_count: number;
  rebel_count: number;
  categories: string[];
  current_streak: number;
  longest_streak: number;
  vote_time_seconds?: number;
  vote_hour?: number;
  // Premium badge context (provided client-side)
  owned_cosmetics_count?: number;
  theme_changes_count?: number;
  premium_days?: number;
  basic_badges_unlocked?: number;
  total_basic_badges?: number;
}

export interface UnlockedBadge {
  badge_id: string;
  unlocked_at: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first_vote',
    emoji: '🗳️',
    titleKey: 'badgeFirstVote',
    descKey: 'badgeFirstVoteDesc',
    check: (ctx) => ctx.total_votes >= 1,
  },
  {
    id: 'speed_demon',
    emoji: '⚡',
    titleKey: 'badgeSpeedDemon',
    descKey: 'badgeSpeedDemonDesc',
    check: (ctx) => ctx.vote_time_seconds != null && ctx.vote_time_seconds < 3,
  },
  {
    id: 'night_owl',
    emoji: '🦉',
    titleKey: 'badgeNightOwl',
    descKey: 'badgeNightOwlDesc',
    check: (ctx) => ctx.vote_hour != null && (ctx.vote_hour >= 0 && ctx.vote_hour < 5),
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    titleKey: 'badgeStreak3',
    descKey: 'badgeStreak3Desc',
    check: (ctx) => ctx.current_streak >= 3,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 3), target: 3 }),
  },
  {
    id: 'streak_7',
    emoji: '💪',
    titleKey: 'badgeStreak7',
    descKey: 'badgeStreak7Desc',
    check: (ctx) => ctx.current_streak >= 7,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 7), target: 7 }),
  },
  {
    id: 'streak_14',
    emoji: '⭐',
    titleKey: 'badgeStreak14',
    descKey: 'badgeStreak14Desc',
    check: (ctx) => ctx.current_streak >= 14,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 14), target: 14 }),
  },
  {
    id: 'streak_30',
    emoji: '👑',
    titleKey: 'badgeStreak30',
    descKey: 'badgeStreak30Desc',
    check: (ctx) => ctx.current_streak >= 30,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 30), target: 30 }),
  },
  {
    id: 'streak_50',
    emoji: '💎',
    titleKey: 'badgeStreak50',
    descKey: 'badgeStreak50Desc',
    check: (ctx) => ctx.current_streak >= 50,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 50), target: 50 }),
  },
  {
    id: 'century',
    emoji: '🏆',
    titleKey: 'badgeCentury',
    descKey: 'badgeCenturyDesc',
    check: (ctx) => ctx.current_streak >= 100,
    progress: (ctx) => ({ current: Math.min(ctx.current_streak, 100), target: 100 }),
  },
  {
    id: 'conformist',
    emoji: '🤝',
    titleKey: 'badgeConformist',
    descKey: 'badgeConformistDesc',
    check: (ctx) => ctx.majority_count >= 10,
    progress: (ctx) => ({ current: Math.min(ctx.majority_count, 10), target: 10 }),
  },
  {
    id: 'rebel',
    emoji: '😈',
    titleKey: 'badgeRebel',
    descKey: 'badgeRebelDesc',
    check: (ctx) => ctx.rebel_count >= 10,
    progress: (ctx) => ({ current: Math.min(ctx.rebel_count, 10), target: 10 }),
  },
  {
    id: 'explorer',
    emoji: '🧭',
    titleKey: 'badgeExplorer',
    descKey: 'badgeExplorerDesc',
    check: (ctx) => ctx.categories.length >= 10,
    progress: (ctx) => ({ current: Math.min(ctx.categories.length, 10), target: 10 }),
  },
  {
    id: 'dedicated',
    emoji: '📊',
    titleKey: 'badgeDedicated',
    descKey: 'badgeDedicatedDesc',
    check: (ctx) => ctx.total_votes >= 50,
    progress: (ctx) => ({ current: Math.min(ctx.total_votes, 50), target: 50 }),
  },
  {
    id: 'veteran',
    emoji: '🎖️',
    titleKey: 'badgeVeteran',
    descKey: 'badgeVeteranDesc',
    check: (ctx) => ctx.total_votes >= 100,
    progress: (ctx) => ({ current: Math.min(ctx.total_votes, 100), target: 100 }),
  },
  // Premium badges
  {
    id: 'collector',
    emoji: '🎨',
    titleKey: 'badgeCollector',
    descKey: 'badgeCollectorDesc',
    check: (ctx) => (ctx.owned_cosmetics_count ?? 0) >= 3,
    progress: (ctx) => ({ current: Math.min(ctx.owned_cosmetics_count ?? 0, 3), target: 3 }),
    isPremium: true,
  },
  {
    id: 'fashionista',
    emoji: '💅',
    titleKey: 'badgeFashionista',
    descKey: 'badgeFashionistaDesc',
    check: (ctx) => (ctx.theme_changes_count ?? 0) >= 5,
    progress: (ctx) => ({ current: Math.min(ctx.theme_changes_count ?? 0, 5), target: 5 }),
    isPremium: true,
  },
  {
    id: 'supporter',
    emoji: '💖',
    titleKey: 'badgeSupporter',
    descKey: 'badgeSupporterDesc',
    check: (ctx) => (ctx.premium_days ?? 0) >= 30,
    progress: (ctx) => ({ current: Math.min(ctx.premium_days ?? 0, 30), target: 30 }),
    isPremium: true,
  },
  {
    id: 'completionist',
    emoji: '🌟',
    titleKey: 'badgeCompletionist',
    descKey: 'badgeCompletionistDesc',
    check: (ctx) => ctx.basic_badges_unlocked != null && ctx.total_basic_badges != null && ctx.basic_badges_unlocked >= ctx.total_basic_badges,
    isPremium: true,
  },
];

export function getBadgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export async function fetchUserBadges(): Promise<UnlockedBadge[]> {
  const { data, error } = await supabase.rpc('get_user_badges');
  if (error) {
    // Silently fail if migration not yet applied
    return [];
  }
  return (data as UnlockedBadge[]) ?? [];
}

export async function fetchBadgeContext(): Promise<BadgeContext | null> {
  const { data, error } = await supabase.rpc('get_badge_context');
  if (error) {
    // Silently fail if migration not yet applied
    return null;
  }
  return data as BadgeContext;
}

export async function unlockBadge(badgeId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('unlock_badge', { p_badge_id: badgeId });
  if (error) {
    // Silently fail if migration not yet applied
    return false;
  }
  return data as boolean;
}

/**
 * Find the next closest badge the user can earn with progress tracking
 */
export function getNextBadgeProgress(
  ctx: BadgeContext,
  unlockedIds: Set<string>
): { badge: BadgeDef; current: number; target: number } | null {
  for (const badge of BADGES) {
    if (unlockedIds.has(badge.id)) continue;
    if (!badge.progress) continue;
    const prog = badge.progress(ctx);
    if (prog && prog.current < prog.target) {
      return { badge, ...prog };
    }
  }
  return null;
}
