import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useCoins() {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCoins = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_coin_balance');
      if (!error && data) {
        setCoins((data as { coins: number }).coins);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const spendCoins = useCallback(async (cosmeticId: string, price: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.rpc('purchase_cosmetic_with_coins', {
        p_cosmetic_id: cosmeticId,
        p_price: price,
      });
      if (error) return { success: false, error: error.message };
      const result = data as { success: boolean; error?: string; current_coins: number };
      if (result.success) {
        setCoins(result.current_coins);
      }
      return { success: result.success, error: result.error };
    } catch {
      return { success: false, error: 'unknown' };
    }
  }, []);

  const awardBadgeCoins = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('award_badge_coins');
      if (!error && data) {
        const result = data as { success: boolean; coins: number };
        if (result.success) setCoins(result.coins);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const awardShareCoins = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('award_share_coins');
      if (!error && data) {
        const result = data as { success: boolean; coins: number };
        if (result.success) setCoins(result.coins);
        return result.success;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Direct setter for when coins come from vote response
  const updateCoins = useCallback((newTotal: number) => {
    setCoins(newTotal);
  }, []);

  return {
    coins,
    loading,
    fetchCoins,
    spendCoins,
    awardBadgeCoins,
    awardShareCoins,
    updateCoins,
  };
}
