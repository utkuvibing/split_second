// Coin prices for cosmetics (defined in frontend to avoid extra DB table)
export const COIN_PRICES: Record<string, number> = {
  // Themes
  ocean: 150,
  sunset: 150,
  forest: 150,
  rose: 150,
  monochrome: 200,
  // Frames
  gold: 100,
  neon: 100,
  fire: 120,
  ice: 120,
  // Effects
  confetti: 100,
  lightning: 100,
  hearts: 100,
  // New items
  cyber: 300,
  cherry: 250,
  platinum: 200,
  prism: 250,
  fireworks: 200,
  snowfall: 150,
};

// Coin reward amounts
export const COIN_REWARDS = {
  question_vote: 5,
  day_complete: 5,
  streak_3: 5,
  streak_7: 15,
  streak_14: 25,
  streak_30: 50,
  badge: 20,
  share: 5,
  // Mystery box ranges (actual amount determined server-side)
  mystery_box_common: 15,   // avg 10-20
  mystery_box_rare: 28,     // avg 20-35
  mystery_box_epic: 43,     // avg 35-50
  mystery_box_legendary: 75, // avg 50-100
  // Community
  question_promoted: 100,
};

// Coin costs for actions
export const COIN_COSTS = {
  submit_question: 50,
  change_nickname: 100,
};

// Get price for a cosmetic, 0 for free items
export function getCoinPrice(cosmeticId: string): number {
  return COIN_PRICES[cosmeticId] ?? 0;
}

// Check if a cosmetic is free (no coin cost)
export function isFreeCosmetic(cosmeticId: string): boolean {
  return cosmeticId === 'default' || cosmeticId === 'none' || getCoinPrice(cosmeticId) === 0;
}

// Check if a cosmetic is premium-free (isPremium but no coin price)
export function isPremiumFreeItem(cosmeticId: string): boolean {
  return getCoinPrice(cosmeticId) === 0
    && cosmeticId !== 'default'
    && cosmeticId !== 'none';
}
