import { supabase } from './supabase';

export interface UserStats {
  total_votes: number;
  majority_percent: number;
  top_category: string;
  current_streak: number;
  longest_streak: number;
}

export async function getUserStats(): Promise<UserStats | null> {
  const { data, error } = await supabase.rpc('get_user_stats');

  if (error) {
    console.error('Error fetching user stats:', error.message);
    return null;
  }

  return data as UserStats;
}
