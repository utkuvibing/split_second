export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  scheduled_date: string;
  category: string;
  is_active: boolean;
  created_at: string;
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
}
