import { useState, useEffect, useCallback } from 'react';
import {
  BADGES,
  BadgeContext,
  UnlockedBadge,
  fetchUserBadges,
  fetchBadgeContext,
  unlockBadge,
} from '../lib/badges';

export function useBadges() {
  const [unlockedBadges, setUnlockedBadges] = useState<UnlockedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBadges()
      .then(setUnlockedBadges)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /**
   * Check for new badge unlocks after a vote.
   * `localCtx` provides vote_time_seconds and vote_hour from the client.
   * Returns array of newly unlocked badge IDs.
   */
  const checkNewUnlocks = useCallback(
    async (localCtx: { vote_time_seconds?: number; vote_hour?: number }): Promise<string[]> => {
      const serverCtx = await fetchBadgeContext();
      if (!serverCtx) return [];

      const ctx: BadgeContext = { ...serverCtx, ...localCtx };
      const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));
      const newlyUnlocked: string[] = [];

      for (const badge of BADGES) {
        if (unlockedIds.has(badge.id)) continue;
        if (badge.check(ctx)) {
          const success = await unlockBadge(badge.id);
          if (success) {
            newlyUnlocked.push(badge.id);
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        // Refetch to get accurate unlocked_at timestamps
        const updated = await fetchUserBadges();
        setUnlockedBadges(updated);
      }

      return newlyUnlocked;
    },
    [unlockedBadges]
  );

  const refetch = useCallback(async () => {
    const data = await fetchUserBadges();
    setUnlockedBadges(data);
  }, []);

  return { unlockedBadges, loading, checkNewUnlocks, refetch };
}
