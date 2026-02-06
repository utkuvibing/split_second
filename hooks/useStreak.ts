import { useState, useEffect } from 'react';
import { StreakData, getUserStreak } from '../lib/streaks';

export function useStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getUserStreak();
    setStreak(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { streak, loading, refetch: fetch };
}
