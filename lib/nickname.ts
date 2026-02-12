import { supabase } from './supabase';
import { COIN_COSTS } from './coins';

export type SetNameError = 'invalid_length' | 'insufficient_coins' | 'server_error';

export async function setDisplayName(
  name: string,
  isChange: boolean
): Promise<{ success: boolean; display_name?: string; error?: SetNameError }> {
  const cost = isChange ? COIN_COSTS.change_nickname : 0;
  const { data, error } = await supabase.rpc('set_display_name', {
    p_name: name,
    p_cost: cost,
  });
  if (error) {
    return { success: false, error: 'server_error' };
  }
  return data as { success: boolean; display_name?: string; error?: SetNameError };
}
