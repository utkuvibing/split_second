// Premium & cosmetics type definitions

export interface UserProfile {
  is_premium: boolean;
  premium_until: string | null;
  coins: number;
  friend_code: string;
  theme_id: string;
  frame_id: string;
  vote_effect_id: string;
}

export interface OwnedCosmetic {
  cosmetic_id: string;
  purchased_at: string;
}

export type CosmeticSlot = 'theme' | 'frame' | 'vote_effect';

export interface ThemeColors {
  background: string;
  surface: string;
  optionA: string;
  optionB: string;
  accent: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
}

export interface ThemeDef {
  id: string;
  nameKey: string;
  colors: ThemeColors;
  isPremium: boolean;
}

export interface CosmeticDef {
  id: string;
  nameKey: string;
  descKey: string;
  slot: CosmeticSlot;
  isPremium: boolean;
  emoji?: string;
}

export interface FrameDef extends CosmeticDef {
  slot: 'frame';
  borderColors: string[];
}

export interface VoteEffectDef extends CosmeticDef {
  slot: 'vote_effect';
}
