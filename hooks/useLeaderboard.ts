import { useState, useEffect, useCallback } from 'react';
import { LeaderboardData, fetchLeaderboard } from '../lib/leaderboard';

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const result = await fetchLeaderboard();
    setData(result);
    setLoading(false);
  }, []);

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
