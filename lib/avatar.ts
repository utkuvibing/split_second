import { supabase } from './supabase';

export async function setAvatar(
  avatarId: string | null
): Promise<{ success: boolean }> {
  const { data, error } = await supabase.rpc('set_avatar', {
    p_avatar_id: avatarId,
  });
  if (error) return { success: false };
  return data as { success: boolean };
}

export type PurchaseAvatarError = 'already_owned' | 'insufficient_coins';

export async function purchaseAvatar(
  avatarId: string,
  price: number
): Promise<{ success: boolean; error?: PurchaseAvatarError }> {
  const { data, error } = await supabase.rpc('purchase_avatar', {
    p_avatar_id: avatarId,
    p_price: price,
  });
  if (error) return { success: false };
  return data as { success: boolean; error?: PurchaseAvatarError };
}

export async function getOwnedAvatars(): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_owned_avatars');
  if (error) return [];
  return (data as string[]) ?? [];
}
