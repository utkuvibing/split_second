import { supabase } from './supabase';

export type SortMode = 'hot' | 'new' | 'top';
export type CommunityVoteType = 'up' | 'down' | 'report';

export interface CommunityQuestion {
  id: string;
  option_a: string;
  option_b: string;
  category: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author_display_name: string | null;
  author_friend_code: string;
  user_vote: CommunityVoteType | null;
}

export interface MySubmission {
  id: string;
  option_a: string;
  option_b: string;
  category: string;
  status: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export async function getCommunityQuestions(
  sort: SortMode = 'hot',
  limit = 20,
  offset = 0
): Promise<CommunityQuestion[]> {
  const { data, error } = await supabase.rpc('get_community_questions', {
    p_sort: sort,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) return [];
  return (data as CommunityQuestion[]) ?? [];
}

export async function submitCommunityQuestion(
  optionA: string,
  optionB: string,
  category = 'community'
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('submit_community_question', {
    p_option_a: optionA,
    p_option_b: optionB,
    p_category: category,
  });
  if (error) return { success: false, error: 'submit_failed' };
  return data as { success: boolean; error?: string };
}

export async function voteCommunityQuestion(
  questionId: string,
  voteType: CommunityVoteType
): Promise<{ success: boolean }> {
  const { data, error } = await supabase.rpc('vote_community_question', {
    p_question_id: questionId,
    p_vote_type: voteType,
  });
  if (error) return { success: false };
  return data as { success: boolean };
}

export async function getMySubmissions(): Promise<MySubmission[]> {
  const { data, error } = await supabase.rpc('get_my_submissions');
  if (error) return [];
  return (data as MySubmission[]) ?? [];
}
