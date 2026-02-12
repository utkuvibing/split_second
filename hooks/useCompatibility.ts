import { useState, useEffect, useCallback } from 'react';
import { PersonalityAxes } from '../lib/personality';
import { calculateCompatibility, CompatibilityResult } from '../lib/compatibility';
import { supabase } from '../lib/supabase';

export interface FriendWithPersonality {
  friend_id: string;
  friend_code: string;
  friend_display_name: string | null;
  friend_avatar_id: string | null;
  axes: PersonalityAxes | null;
}

export interface FriendCompatibility extends FriendWithPersonality {
  compatibility: CompatibilityResult | null;
}

export function useCompatibility(myAxes: PersonalityAxes | null) {
  const [friends, setFriends] = useState<FriendCompatibility[]>([]);
  const [bestMatch, setBestMatch] = useState<FriendCompatibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!myAxes) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: rpcError } = await supabase.rpc('get_friends_with_personality');
      if (rpcError) {
        console.warn('get_friends_with_personality RPC error:', rpcError.message);
        setError(rpcError.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setLoading(false);
        return;
      }

      const friendsList = data as FriendWithPersonality[];
      const withCompatibility: FriendCompatibility[] = friendsList.map((friend) => ({
        ...friend,
        compatibility: friend.axes
          ? calculateCompatibility(myAxes, friend.axes)
          : null,
      }));

      // Sort by compatibility score descending, friends without personality at the end
      withCompatibility.sort((a, b) => {
        if (a.compatibility && b.compatibility) {
          return b.compatibility.overallScore - a.compatibility.overallScore;
        }
        if (a.compatibility) return -1;
        if (b.compatibility) return 1;
        return 0;
      });

      setFriends(withCompatibility);

      // Best match = highest score friend
      const best = withCompatibility.find((f) => f.compatibility !== null);
      setBestMatch(best ?? null);
    } catch (e) {
      console.warn('useCompatibility error:', e);
      setError('unexpected_error');
    } finally {
      setLoading(false);
    }
  }, [myAxes]);

  useEffect(() => {
    load();
  }, [load]);

  return { friends, bestMatch, loading, error, refetch: load };
}
