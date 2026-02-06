import { useState, useEffect, useRef } from 'react';
import { VoteResults } from '../types/database';
import { submitVote, getUserVote, getResults } from '../lib/votes';

export function useVote(questionId: string | undefined) {
  const [userChoice, setUserChoice] = useState<'a' | 'b' | null>(null);
  const [results, setResults] = useState<VoteResults | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voteTimeSeconds, setVoteTimeSeconds] = useState<number | null>(null);
  const questionShownAt = useRef<number | null>(null);

  // Track when question is first shown
  useEffect(() => {
    if (questionId && !userChoice) {
      questionShownAt.current = Date.now();
    }
  }, [questionId, userChoice]);

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

    // Calculate vote time
    const elapsed = questionShownAt.current
      ? (Date.now() - questionShownAt.current) / 1000
      : null;
    if (elapsed != null) {
      setVoteTimeSeconds(elapsed);
    }

    const result = await submitVote(questionId, choice);
    if (result) {
      setUserChoice(choice);
      setResults(result);
    }

    setSubmitting(false);
  };

  const hasVoted = userChoice !== null;

  return { vote, userChoice, results, hasVoted, submitting, loading, voteTimeSeconds };
}
