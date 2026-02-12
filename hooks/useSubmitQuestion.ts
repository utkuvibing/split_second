import { useState } from 'react';
import { submitCommunityQuestion } from '../lib/communityQuestions';

export function useSubmitQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    optionA: string,
    optionB: string,
    category = 'community'
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    const result = await submitCommunityQuestion(optionA, optionB, category);
    setLoading(false);

    if (result.success) return true;
    const errCode = result.error ?? 'submit_failed';
    setError(errCode);
    return false;
  };

  const clearError = () => setError(null);

  return { submit, loading, error, clearError };
}
