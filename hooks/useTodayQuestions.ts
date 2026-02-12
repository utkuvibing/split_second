import { useState, useEffect, useCallback } from 'react';
import { Question } from '../types/database';
import { getTodayQuestions } from '../lib/questions';
import { localizeQuestion } from '../lib/i18n';

export function useTodayQuestions(isAuthenticated: boolean) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const qs = await getTodayQuestions();
      setQuestions(qs.map(localizeQuestion));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { questions, loading, error, refetch: fetch };
}
