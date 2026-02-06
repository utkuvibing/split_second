import { useState, useEffect } from 'react';
import { initAuth } from '../lib/auth';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth()
      .then(setUserId)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { userId, loading };
}
