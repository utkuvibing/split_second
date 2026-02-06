import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { OwnedCosmetic, CosmeticSlot } from '../types/premium';
import { getDevOwnAll } from '../lib/premium';
import { FRAMES, VOTE_EFFECTS } from '../lib/cosmetics';
import { THEMES } from '../lib/themes';

export function useCosmetics() {
  const [owned, setOwned] = useState<OwnedCosmetic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwned = useCallback(async () => {
    try {
      const devOwnAll = await getDevOwnAll();
      if (devOwnAll) {
        // In dev mode with own-all, simulate owning everything
        const allIds = [
          ...THEMES.map((t) => t.id),
          ...FRAMES.map((f) => f.id),
          ...VOTE_EFFECTS.map((e) => e.id),
        ];
        setOwned(allIds.map((id) => ({ cosmetic_id: id, purchased_at: new Date().toISOString() })));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_user_cosmetics');
      if (!error && data) {
        setOwned(data as OwnedCosmetic[]);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwned();
  }, [fetchOwned]);

  const isOwned = useCallback(
    (cosmeticId: string) => {
      // Free items are always "owned"
      if (cosmeticId === 'default' || cosmeticId === 'none') return true;
      return owned.some((o) => o.cosmetic_id === cosmeticId);
    },
    [owned]
  );

  const purchase = useCallback(async (cosmeticId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('purchase_cosmetic', { p_cosmetic_id: cosmeticId });
      if (!error) {
        await fetchOwned();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchOwned]);

  const equip = useCallback(async (slot: CosmeticSlot, cosmeticId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('equip_cosmetic', {
        p_slot: slot,
        p_cosmetic_id: cosmeticId,
      });
      if (!error && data) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    owned,
    loading,
    isOwned,
    purchase,
    equip,
    refetch: fetchOwned,
  };
}
