import { FrameDef, VoteEffectDef } from '../types/premium';

export const FRAMES: FrameDef[] = [
  {
    id: 'none',
    nameKey: 'frameNone',
    descKey: 'frameNoneDesc',
    slot: 'frame',
    isPremium: false,
    borderColors: [],
  },
  {
    id: 'gold',
    nameKey: 'frameGold',
    descKey: 'frameGoldDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#FFD700', '#FFA500'],
  },
  {
    id: 'neon',
    nameKey: 'frameNeon',
    descKey: 'frameNeonDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#00FF88', '#00CCFF'],
  },
  {
    id: 'fire',
    nameKey: 'frameFire',
    descKey: 'frameFireDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#FF4500', '#FF8C00'],
  },
  {
    id: 'ice',
    nameKey: 'frameIce',
    descKey: 'frameIceDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#87CEEB', '#E0F0FF'],
  },
  {
    id: 'platinum',
    nameKey: 'framePlatinum',
    descKey: 'framePlatinumDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#C0C0C0', '#E8E8E8'],
  },
  {
    id: 'prism',
    nameKey: 'framePrism',
    descKey: 'framePrismDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#FF0080', '#8000FF', '#0080FF'],
  },
  {
    id: 'velvet',
    nameKey: 'frameVelvet',
    descKey: 'frameVelvetDesc',
    slot: 'frame',
    isPremium: true,
    borderColors: ['#8B008B', '#FF1493'],
  },
];

export const VOTE_EFFECTS: VoteEffectDef[] = [
  {
    id: 'default',
    nameKey: 'effectDefault',
    descKey: 'effectDefaultDesc',
    slot: 'vote_effect',
    isPremium: false,
    emoji: '👆',
  },
  {
    id: 'confetti',
    nameKey: 'effectConfetti',
    descKey: 'effectConfettiDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '🎉',
  },
  {
    id: 'lightning',
    nameKey: 'effectLightning',
    descKey: 'effectLightningDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '⚡',
  },
  {
    id: 'hearts',
    nameKey: 'effectHearts',
    descKey: 'effectHeartsDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '❤️',
  },
  {
    id: 'fireworks',
    nameKey: 'effectFireworks',
    descKey: 'effectFireworksDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '🎆',
  },
  {
    id: 'snowfall',
    nameKey: 'effectSnowfall',
    descKey: 'effectSnowfallDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '❄️',
  },
  {
    id: 'stardust',
    nameKey: 'effectStardust',
    descKey: 'effectStardustDesc',
    slot: 'vote_effect',
    isPremium: true,
    emoji: '✨',
  },
];

// Box-exclusive frames (not purchasable in shop)
export const BOX_EXCLUSIVE_FRAMES: FrameDef[] = [
  {
    id: 'aurora',
    nameKey: 'frameAurora',
    descKey: 'frameAuroraDesc',
    slot: 'frame',
    isPremium: false,
    borderColors: ['#00FF88', '#8B5CF6'],
    isBoxExclusive: true,
  },
  {
    id: 'galaxy',
    nameKey: 'frameGalaxy',
    descKey: 'frameGalaxyDesc',
    slot: 'frame',
    isPremium: false,
    borderColors: ['#1E3A5F', '#9333EA'],
    isBoxExclusive: true,
  },
  {
    id: 'diamond',
    nameKey: 'frameDiamond',
    descKey: 'frameDiamondDesc',
    slot: 'frame',
    isPremium: false,
    borderColors: ['#B9F2FF', '#FFFFFF'],
    isBoxExclusive: true,
  },
  {
    id: 'phoenix',
    nameKey: 'framePhoenix',
    descKey: 'framePhoenixDesc',
    slot: 'frame',
    isPremium: false,
    borderColors: ['#FF4500', '#FFD700'],
    isBoxExclusive: true,
  },
];

export const ALL_FRAMES = [...FRAMES, ...BOX_EXCLUSIVE_FRAMES];

export function getFrameById(id: string): FrameDef {
  return ALL_FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}

// Box-exclusive effects
export const BOX_EXCLUSIVE_EFFECTS: VoteEffectDef[] = [
  {
    id: 'rainbow',
    nameKey: 'effectRainbow',
    descKey: 'effectRainbowDesc',
    slot: 'vote_effect',
    isPremium: false,
    emoji: '🌈',
  },
  {
    id: 'supernova',
    nameKey: 'effectSupernova',
    descKey: 'effectSupernovaDesc',
    slot: 'vote_effect',
    isPremium: false,
    emoji: '💥',
  },
];

export const ALL_EFFECTS = [...VOTE_EFFECTS, ...BOX_EXCLUSIVE_EFFECTS];

export function getEffectById(id: string): VoteEffectDef {
  return ALL_EFFECTS.find((e) => e.id === id) ?? VOTE_EFFECTS[0];
}
