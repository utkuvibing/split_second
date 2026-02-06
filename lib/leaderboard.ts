import { supabase } from './supabase';

export interface LeaderboardEntry {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_votes: number;
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
export function getPlayerName(userId: string): string {
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
