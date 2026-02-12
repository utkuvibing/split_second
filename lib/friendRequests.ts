import { supabase } from './supabase';

export interface FriendRequest {
  id: string;
  from_user_id: string;
  from_friend_code: string;
  from_display_name: string | null;
  created_at: string;
}

export async function sendFriendRequest(
  code: string,
  isPremium: boolean
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('send_friend_request', {
    p_code: code.toUpperCase(),
    p_is_premium: isPremium,
  });
  if (error) return { success: false, error: 'not_found' };
  return data as { success: boolean; error?: string };
}

export async function respondToRequest(
  requestId: string,
  accept: boolean
): Promise<{ success: boolean }> {
  const { data, error } = await supabase.rpc('respond_friend_request', {
    p_request_id: requestId,
    p_accept: accept,
  });
  if (error) return { success: false };
  return data as { success: boolean };
}

export async function getPendingRequests(): Promise<FriendRequest[]> {
  const { data, error } = await supabase.rpc('get_pending_friend_requests');
  if (error) return [];
  return (data as FriendRequest[]) ?? [];
}
