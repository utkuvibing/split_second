import { useState, useEffect, useCallback } from 'react';
import { PersonalityAxes, ContentAxes, DatingProfile } from '../lib/personality';
import {
  calculateCompatibility,
  calculateDatingCompatibility,
  flattenFriendAxes,
  CompatibilityProfile,
  CompatibilityResult,
} from '../lib/compatibility';
import { supabase } from '../lib/supabase';

export interface FriendWithPersonality {
  friend_id: string;
  friend_code: string;
  friend_display_name: string | null;
  friend_avatar_id: string | null;
  axes: CompatibilityProfile | null;
  dating_profile?: DatingProfile | null;
}

export interface FriendCompatibility extends FriendWithPersonality {
  compatibility: CompatibilityResult | null;
}

export function buildCompatibilityProfile(
  behavioral: PersonalityAxes | null,
  content: Partial<ContentAxes> | null,
): CompatibilityProfile | null {
  if (!behavioral) return null;
  return { ...behavioral, ...(content ?? {}) };
}

export function useCompatibility(
  myAxes: CompatibilityProfile | null,
  myDating?: DatingProfile | null,
) {
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

      const friendsList = (data as Array<Record<string, unknown>>).map((row) => {
        const rawAxes = row.axes as Record<string, unknown> | null;
        const datingProfile = (rawAxes?.dating_profile as DatingProfile | null) ?? null;
        return {
          friend_id: row.friend_id as string,
          friend_code: row.friend_code as string,
          friend_display_name: row.friend_display_name as string | null,
          friend_avatar_id: row.friend_avatar_id as string | null,
          axes: flattenFriendAxes(rawAxes),
          dating_profile: datingProfile,
        } satisfies FriendWithPersonality;
      });

      const withCompatibility: FriendCompatibility[] = friendsList.map((friend) => {
        if (!friend.axes) {
          return { ...friend, compatibility: null };
        }
        const compatibility = calculateCompatibility(myAxes, friend.axes);
        const datingScore = calculateDatingCompatibility(myDating, friend.dating_profile);
        return {
          ...friend,
          compatibility: datingScore != null
            ? { ...compatibility, datingScore }
            : compatibility,
        };
      });

      withCompatibility.sort((a, b) => {
        if (a.compatibility && b.compatibility) {
          return b.compatibility.overallScore - a.compatibility.overallScore;
        }
        if (a.compatibility) return -1;
        if (b.compatibility) return 1;
        return 0;
      });

      setFriends(withCompatibility);
      setBestMatch(withCompatibility.find((f) => f.compatibility !== null) ?? null);
    } catch (e) {
      console.warn('useCompatibility error:', e);
      setError('unexpected_error');
    } finally {
      setLoading(false);
    }
  }, [myAxes, myDating]);

  useEffect(() => {
    load();
  }, [load]);

  return { friends, bestMatch, loading, error, refetch: load };
}
