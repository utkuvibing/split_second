export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  scheduled_date: string;
  category: string;
  is_active: boolean;
  created_at: string;
  time_slot: TimeSlot;
  question_text_tr?: string | null;
  option_a_tr?: string | null;
  option_b_tr?: string | null;
}

export interface Vote {
  id: string;
  user_id: string;
  question_id: string;
  choice: 'a' | 'b';
  created_at: string;
}

export interface VoteResults {
  count_a: number;
  count_b: number;
  total: number;
  success: boolean;
  current_streak?: number;
  longest_streak?: number;
  total_votes?: number;
  coins_earned?: number;
  total_coins?: number;
  votes_today?: number;
  all_today_voted?: boolean;
}

export interface UserProfileRow {
  user_id: string;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCosmeticRow {
  id: string;
  user_id: string;
  cosmetic_id: string;
  purchased_at: string;
}

export interface UserEquippedRow {
  user_id: string;
  theme_id: string;
  frame_id: string;
  vote_effect_id: string;
  updated_at: string;
}
