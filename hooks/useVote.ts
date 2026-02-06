import { useState, useEffect } from 'react';
import { VoteResults } from '../types/database';
import { submitVote, getUserVote, getResults } from '../lib/votes';

export function useVote(questionId: string | undefined) {
  const [userChoice, setUserChoice] = useState<'a' | 'b' | null>(null);
  const [results, setResults] = useState<VoteResults | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user already voted
  useEffect(() => {
    if (!questionId) {
      setLoading(false);
      return;
    }

    (async () => {
      const existingVote = await getUserVote(questionId);
      if (existingVote) {
        setUserChoice(existingVote);
        const existingResults = await getResults(questionId);
        setResults(existingResults);
      }
      setLoading(false);
    })();
  }, [questionId]);

  const vote = async (choice: 'a' | 'b') => {
    if (!questionId || submitting || userChoice) return;
    setSubmitting(true);

    const result = await submitVote(questionId, choice);
    if (result) {
      setUserChoice(choice);
      setResults(result);
    }

    setSubmitting(false);
  };

  const hasVoted = userChoice !== null;

  return { vote, userChoice, results, hasVoted, submitting, loading };
}
