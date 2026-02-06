import { supabase } from './supabase';

export interface VoteHistoryItem {
  question_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  scheduled_date: string;
  category: string;
  user_choice: 'a' | 'b';
  voted_at: string;
  count_a: number;
  count_b: number;
  total: number;
  question_text_tr?: string | null;
  option_a_tr?: string | null;
  option_b_tr?: string | null;
}

export async function getVoteHistory(limitDays?: number): Promise<VoteHistoryItem[]> {
  const { data, error } = await supabase.rpc('get_vote_history');

  if (error) {
    console.error('Error fetching vote history:', error.message);
    return [];
  }

  let items = (data as VoteHistoryItem[]) ?? [];

  // Apply day limit if specified (free tier: last 7 days)
  if (limitDays != null && limitDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - limitDays);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    items = items.filter((item) => item.scheduled_date >= cutoffStr);
  }

  return items;
}
