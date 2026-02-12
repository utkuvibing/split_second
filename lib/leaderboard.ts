import { supabase } from './supabase';
import { getFriendsList } from './friends';

export interface LeaderboardEntry {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_votes: number;
  display_name: string | null;
  avatar_id: string | null;
  rank: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  user_rank: number;
  user_entry: LeaderboardEntry | null;
}

/**
 * Generate a consistent anonymous name from a user_id.
 * Hashes the UUID to a 4-digit number → "Player #1234"
 */
/**
 * Generate a consistent anonymous name from a user_id.
 * If displayName is provided, use it instead.
 */
export function getPlayerName(userId: string, displayName?: string | null): string {
  if (displayName) return displayName;
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & 0xFFFF; // Keep to 16 bits
  }
  const num = (Math.abs(hash) % 9000) + 1000; // 1000-9999
  return `Player #${num}`;
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardData | null> {
  const { data, error } = await supabase.rpc('get_leaderboard', { p_limit: limit });

  if (error) {
    // Silently fail if migration not yet applied
    return null;
  }

  return data as LeaderboardData;
}

/** Fetch leaderboard filtered to friends + current user */
export async function fetchFriendLeaderboard(): Promise<LeaderboardData | null> {
  const [globalData, friends] = await Promise.all([
    fetchLeaderboard(1000),
    getFriendsList(),
  ]);

  if (!globalData) return null;

  const friendIds = new Set(friends.map(f => f.friend_id));
  // Include current user + friends
  const filtered = globalData.entries.filter(
    e => friendIds.has(e.user_id) || e.user_id === globalData.user_entry?.user_id
  );

  // Re-rank within friend group
  const ranked = filtered
    .sort((a, b) => b.total_votes - a.total_votes)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const userEntry = ranked.find(e => e.user_id === globalData.user_entry?.user_id) ?? null;

  return {
    entries: ranked,
    user_rank: userEntry?.rank ?? 0,
    user_entry: userEntry,
  };
}
