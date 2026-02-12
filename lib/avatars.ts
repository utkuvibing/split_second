// Avatar data definitions — 48 emoji avatars in 4 categories, 3 tiers

export type AvatarCategory = 'animals' | 'people' | 'objects' | 'nature';
export type AvatarTier = 'free' | 'coin' | 'premium';

export interface AvatarDef {
  id: string;
  emoji: string;
  category: AvatarCategory;
  tier: AvatarTier;
}

export const AVATAR_CATEGORIES: AvatarCategory[] = ['animals', 'people', 'objects', 'nature'];

export const AVATAR_COIN_PRICE = 50;

const AVATARS: AvatarDef[] = [
  // ─── FREE (28) ───
  // Animals (8)
  { id: 'cat', emoji: '🐱', category: 'animals', tier: 'free' },
  { id: 'dog', emoji: '🐶', category: 'animals', tier: 'free' },
  { id: 'fox', emoji: '🦊', category: 'animals', tier: 'free' },
  { id: 'bear', emoji: '🐻', category: 'animals', tier: 'free' },
  { id: 'panda', emoji: '🐼', category: 'animals', tier: 'free' },
  { id: 'unicorn', emoji: '🦄', category: 'animals', tier: 'free' },
  { id: 'owl', emoji: '🦉', category: 'animals', tier: 'free' },
  { id: 'wolf', emoji: '🐺', category: 'animals', tier: 'free' },
  // Characters (7)
  { id: 'astronaut', emoji: '🧑‍🚀', category: 'people', tier: 'free' },
  { id: 'ninja', emoji: '🥷', category: 'people', tier: 'free' },
  { id: 'zombie', emoji: '🧟', category: 'people', tier: 'free' },
  { id: 'wizard', emoji: '🧙', category: 'people', tier: 'free' },
  { id: 'alien', emoji: '👽', category: 'people', tier: 'free' },
  { id: 'robot', emoji: '🤖', category: 'people', tier: 'free' },
  { id: 'ghost', emoji: '👻', category: 'people', tier: 'free' },
  // Objects (7)
  { id: 'rocket', emoji: '🚀', category: 'objects', tier: 'free' },
  { id: 'crown', emoji: '👑', category: 'objects', tier: 'free' },
  { id: 'diamond', emoji: '💎', category: 'objects', tier: 'free' },
  { id: 'lightning', emoji: '⚡', category: 'objects', tier: 'free' },
  { id: 'fire', emoji: '🔥', category: 'objects', tier: 'free' },
  { id: 'star', emoji: '⭐', category: 'objects', tier: 'free' },
  { id: 'gamepad', emoji: '🎮', category: 'objects', tier: 'free' },
  // Nature (6)
  { id: 'sun', emoji: '☀️', category: 'nature', tier: 'free' },
  { id: 'moon', emoji: '🌙', category: 'nature', tier: 'free' },
  { id: 'rainbow', emoji: '🌈', category: 'nature', tier: 'free' },
  { id: 'snowflake', emoji: '❄️', category: 'nature', tier: 'free' },
  { id: 'blossom', emoji: '🌸', category: 'nature', tier: 'free' },
  { id: 'tree', emoji: '🌲', category: 'nature', tier: 'free' },

  // ─── COIN — 50 coin each (10) ───
  { id: 'frog', emoji: '🐸', category: 'animals', tier: 'coin' },
  { id: 'lion', emoji: '🦁', category: 'animals', tier: 'coin' },
  { id: 'penguin', emoji: '🐧', category: 'animals', tier: 'coin' },
  { id: 'skull', emoji: '💀', category: 'people', tier: 'coin' },
  { id: 'clown', emoji: '🤡', category: 'people', tier: 'coin' },
  { id: 'target', emoji: '🎯', category: 'objects', tier: 'coin' },
  { id: 'crystal', emoji: '🔮', category: 'objects', tier: 'coin' },
  { id: 'music', emoji: '🎵', category: 'objects', tier: 'coin' },
  { id: 'wave', emoji: '🌊', category: 'nature', tier: 'coin' },
  { id: 'sparkle', emoji: '💫', category: 'nature', tier: 'coin' },

  // ─── PREMIUM (10) ───
  { id: 'dragon', emoji: '🐉', category: 'animals', tier: 'premium' },
  { id: 'shark', emoji: '🦈', category: 'animals', tier: 'premium' },
  { id: 'peacock', emoji: '🦚', category: 'animals', tier: 'premium' },
  { id: 'mermaid', emoji: '🧜', category: 'people', tier: 'premium' },
  { id: 'fairy', emoji: '🧚', category: 'people', tier: 'premium' },
  { id: 'superhero', emoji: '🦸', category: 'people', tier: 'premium' },
  { id: 'theater', emoji: '🎭', category: 'objects', tier: 'premium' },
  { id: 'gem', emoji: '💠', category: 'objects', tier: 'premium' },
  { id: 'volcano', emoji: '🌋', category: 'nature', tier: 'premium' },
  { id: 'aurora', emoji: '🌌', category: 'nature', tier: 'premium' },

  // ─── COIN HIGH — 75 coin each (5) ───
  { id: 'octopus', emoji: '🐙', category: 'animals', tier: 'coin' },
  { id: 'butterfly', emoji: '🦋', category: 'animals', tier: 'coin' },
  { id: 'cowboy', emoji: '🤠', category: 'people', tier: 'coin' },
  { id: 'dice', emoji: '🎲', category: 'objects', tier: 'coin' },
  { id: 'comet', emoji: '☄️', category: 'nature', tier: 'coin' },

  // ─── PREMIUM (new) ───
  { id: 'eagle', emoji: '🦅', category: 'animals', tier: 'premium' },
  { id: 'angel', emoji: '👼', category: 'people', tier: 'premium' },
  { id: 'trident', emoji: '🔱', category: 'objects', tier: 'premium' },
];

// Per-avatar prices (overrides AVATAR_COIN_PRICE for specific avatars)
export const AVATAR_PRICES: Record<string, number> = {
  octopus: 75,
  butterfly: 75,
  cowboy: 75,
  dice: 75,
  comet: 75,
};

export function getAvatarPrice(id: string): number {
  return AVATAR_PRICES[id] ?? AVATAR_COIN_PRICE;
}

const avatarMap = new Map(AVATARS.map(a => [a.id, a]));

export function getAvatarById(id: string | null): AvatarDef | null {
  if (!id) return null;
  return avatarMap.get(id) ?? null;
}

export function getAvatarsByCategory(category: AvatarCategory): AvatarDef[] {
  return AVATARS.filter(a => a.category === category);
}
