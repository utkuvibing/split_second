import { useState, useEffect } from 'react';
import { DailyStats, getDailyStats } from '../lib/globalStats';

export function useGlobalStats() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
