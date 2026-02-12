import { supabase } from './supabase';

export type BoxRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type RewardType = 'coins' | 'cosmetic' | 'boost';

export interface MysteryBox {
  id: string;
  rarity: BoxRarity;
  source: string;
  created_at: string;
}

export interface BoxDropResult {
  dropped: boolean;
  box_id?: string;
  rarity?: BoxRarity;
}

export interface BoxOpenResult {
  success: boolean;
  reward_type?: RewardType;
  reward_value?: string;
  rarity?: BoxRarity;
  error?: string;
}

export const RARITY_COLORS: Record<BoxRarity, string> = {
  common: '#A0A0A0',
  rare: '#4DA6FF',
  epic: '#A855F7',
  legendary: '#FFD700',
};

export const RARITY_EMOJIS: Record<BoxRarity, string> = {
  common: '📦',
  rare: '💎',
  epic: '🔮',
  legendary: '🌟',
};

// Cosmetics that can only be obtained from mystery boxes
export const BOX_EXCLUSIVE_COSMETICS = [
  'aurora', 'galaxy',       // rare frames
  'diamond', 'rainbow',     // epic effects
  'phoenix', 'supernova',   // legendary frames/effects
];

export async function checkMysteryBoxDrop(): Promise<BoxDropResult> {
  const { data, error } = await supabase.rpc('check_mystery_box_drop');
  if (error) return { dropped: false };
  return data as BoxDropResult;
}

export async function openMysteryBox(boxId: string): Promise<BoxOpenResult> {
  const { data, error } = await supabase.rpc('open_mystery_box', { p_box_id: boxId });
  if (error) return { success: false, error: 'open_failed' };
  return data as BoxOpenResult;
}

export async function getUnopenedBoxes(): Promise<MysteryBox[]> {
  const { data, error } = await supabase.rpc('get_unopened_boxes');
  if (error) return [];
  return (data as MysteryBox[]) ?? [];
}
