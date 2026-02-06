import { useState, useEffect } from 'react';
import { UserStats, getUserStats } from '../lib/stats';

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getUserStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { stats, loading, refetch: fetch };
}
