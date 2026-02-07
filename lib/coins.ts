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
};

// Coin reward amounts
export const COIN_REWARDS = {
  daily_vote: 10,
  streak_3: 5,
  streak_7: 15,
  streak_14: 25,
  streak_30: 50,
  badge: 20,
  share: 5,
};

// Get price for a cosmetic, 0 for free items
export function getCoinPrice(cosmeticId: string): number {
  return COIN_PRICES[cosmeticId] ?? 0;
}

// Check if a cosmetic is free (no coin cost)
export function isFreeCosmetic(cosmeticId: string): boolean {
  return cosmeticId === 'default' || cosmeticId === 'none' || getCoinPrice(cosmeticId) === 0;
}
