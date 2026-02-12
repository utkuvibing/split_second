import { useState, useEffect, useCallback } from 'react';
import { LeaderboardData, fetchLeaderboard, fetchFriendLeaderboard } from '../lib/leaderboard';

export function useLeaderboard(tab: 'global' | 'friends' = 'global') {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const result = tab === 'friends'
      ? await fetchFriendLeaderboard()
      : await fetchLeaderboard();
    setData(result);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    entries: data?.entries ?? [],
    userRank: data?.user_rank ?? 0,
    userEntry: data?.user_entry ?? null,
    loading,
    refetch: fetch,
  };
}
