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
];

export function getFrameById(id: string): FrameDef {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}

export function getEffectById(id: string): VoteEffectDef {
  return VOTE_EFFECTS.find((e) => e.id === id) ?? VOTE_EFFECTS[0];
}
