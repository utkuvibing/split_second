import { supabase } from './supabase';

export const FREE_FRIEND_LIMIT = 3;

export interface Friend {
  friend_id: string;
  friend_code: string;
  friend_display_name: string | null;
  friend_avatar_id: string | null;
  created_at: string;
  compatibility: number | null;
}

export interface FriendVote {
  friend_id: string;
  friend_code: string;
  friend_display_name: string | null;
  friend_avatar_id: string | null;
  choice: 'a' | 'b' | null;
  voted_at: string | null;
}

export type AddFriendError = 'not_found' | 'self' | 'already_friends' | 'already_pending' | 'limit_reached';

export async function addFriendByCode(
  code: string,
  isPremium: boolean
): Promise<{ success: boolean; error?: AddFriendError }> {
  const { data, error } = await supabase.rpc('send_friend_request', {
    p_code: code.toUpperCase(),
    p_is_premium: isPremium,
  });
  if (error) return { success: false, error: 'not_found' };
  return data as { success: boolean; error?: AddFriendError };
}

export async function getFriendsList(): Promise<Friend[]> {
  const { data, error } = await supabase.rpc('get_friends_list');
  if (error) return [];
  return (data as Friend[]) ?? [];
}

export async function getFriendVotesForQuestion(questionId: string): Promise<FriendVote[]> {
  const { data, error } = await supabase.rpc('get_friend_votes_for_question', {
    p_question_id: questionId,
  });
  if (error) return [];
  return (data as FriendVote[]) ?? [];
}

export async function removeFriend(friendId: string): Promise<boolean> {
  const { error } = await supabase.rpc('remove_friend', { p_friend_id: friendId });
  return !error;
}

/** Get compatibility label key based on score */
export function getCompatibilityKey(score: number): string {
  if (score <= 20) return 'compatibilityLow';
  if (score <= 40) return 'compatibilityMedLow';
  if (score <= 60) return 'compatibilityMed';
  if (score <= 80) return 'compatibilityMedHigh';
  return 'compatibilityHigh';
}

/** Get display name: prefer nickname, fallback to friend_code */
export function getFriendDisplayName(friendCode: string, displayName?: string | null): string {
  return displayName || friendCode;
}
