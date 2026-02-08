import { useState, useEffect } from 'react';
import { FriendVote, getFriendVotesForQuestion } from '../lib/friends';

export function useFriendVotes(questionId: string | undefined, hasVoted: boolean) {
  const [friendVotes, setFriendVotes] = useState<FriendVote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionId || !hasVoted) return;

    setLoading(true);
    getFriendVotesForQuestion(questionId)
      .then(setFriendVotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [questionId, hasVoted]);

  return { friendVotes, loading };
}
