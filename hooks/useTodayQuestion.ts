import { useState, useEffect } from 'react';
import { Question } from '../types/database';
import { getTodayQuestion } from '../lib/questions';
import { localizeQuestion } from '../lib/i18n';

export function useTodayQuestion(isAuthenticated: boolean) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const q = await getTodayQuestion();
      setQuestion(q ? localizeQuestion(q) : null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [isAuthenticated]);

  return { question, loading, error, refetch: fetch };
}
