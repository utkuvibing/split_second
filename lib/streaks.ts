import { supabase } from './supabase';

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_votes: number;
}

export async function getUserStreak(): Promise<StreakData | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('user_streaks')
    .select('current_streak, longest_streak, total_votes')
    .eq('user_id', session.user.id)
    .single();

  if (error) return null;
  return data as StreakData;
}

export const MILESTONES = [3, 7, 14, 30, 50, 100] as const;

export function getNextMilestone(currentStreak: number): number | null {
  for (const m of MILESTONES) {
    if (currentStreak < m) return m;
  }
  return null;
}

export function isNewMilestone(currentStreak: number): boolean {
  return MILESTONES.includes(currentStreak as typeof MILESTONES[number]);
}
