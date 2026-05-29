import { supabase } from './supabase';
import { VoteResults } from '../types/database';
import { getAppLocalDateKey } from './date';

export async function submitVote(
  questionId: string,
  choice: 'a' | 'b',
  voteTimeSeconds?: number
): Promise<VoteResults | null> {
  const { data, error } = await supabase.rpc('submit_vote_and_get_results', {
    p_question_id: questionId,
    p_choice: choice,
    p_vote_time: voteTimeSeconds ?? null,
    p_local_date: getAppLocalDateKey(),
  });

  if (error) {
    const isDuplicateVote =
      error.code === '23505' ||
      error.message.includes('votes_user_id_question_id_key');

    if (isDuplicateVote) {
      const existingChoice = await getUserVote(questionId);
      const existingResults = await getResults(questionId);
      if (existingChoice && existingResults) {
        return {
          ...existingResults,
          success: true,
          coins_earned: 0,
        };
      }
    }

    console.error('Vote submission failed:', error.message);
    return null;
  }

  const results = data as VoteResults;
  if (!results?.success) {
    console.error('Vote submission rejected:', (results as { error?: string })?.error);
    return null;
  }

  return results;
}

export async function getUserVote(
  questionId: string
): Promise<'a' | 'b' | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('votes')
    .select('choice')
    .eq('question_id', questionId)
    .eq('user_id', session.user.id)
    .single();

  if (error) return null;
  return data?.choice as 'a' | 'b' | null;
}

export async function getResults(
  questionId: string
): Promise<VoteResults | null> {
  const { data, error } = await supabase
    .from('question_results')
    .select('*')
    .eq('question_id', questionId)
    .single();

  if (error) {
    console.error('Error fetching results:', error.message);
    return null;
  }

  return {
    count_a: data.count_a,
    count_b: data.count_b,
    total: data.total_votes,
    success: true,
  };
}
