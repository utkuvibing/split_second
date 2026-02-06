import { supabase } from './supabase';

export interface DailyStats {
  today_votes: number;
  total_voters: number;
}

export async function getDailyStats(): Promise<DailyStats | null> {
  const { data, error } = await supabase.rpc('get_daily_stats');

  if (error) {
    console.error('Error fetching daily stats:', error.message);
    return null;
  }

  return data as DailyStats;
}
