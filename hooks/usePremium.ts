import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/premium';
import { getDevPremium } from '../lib/premium';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [equippedTheme, setEquippedTheme] = useState('default');
  const [equippedFrame, setEquippedFrame] = useState('none');
  const [equippedEffect, setEquippedEffect] = useState('default');
  const [friendCode, setFriendCode] = useState('');
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      // Check dev toggle first
      const devPremium = await getDevPremium();

      // Fetch server profile
      const { data, error } = await supabase.rpc('get_or_create_profile');
      if (!error && data) {
        const profile = data as UserProfile;
        setIsPremium(devPremium || profile.is_premium);
        setPremiumUntil(profile.premium_until);
        setEquippedTheme(profile.theme_id || 'default');
        setEquippedFrame(profile.frame_id || 'none');
        setEquippedEffect(profile.vote_effect_id || 'default');
        setFriendCode(profile.friend_code ?? '');
        setCoins(profile.coins ?? 0);
      } else {
        // If RPC not available yet, just use dev toggle
        setIsPremium(devPremium);
      }
    } catch {
      // Silently fail - premium features just won't be available
      const devPremium = await getDevPremium();
      setIsPremium(devPremium);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchProfile();
  }, [fetchProfile]);

  return {
    isPremium,
    premiumUntil,
    equippedTheme,
    equippedFrame,
    equippedEffect,
    friendCode,
    coins,
    loading,
    refetch,
  };
}
