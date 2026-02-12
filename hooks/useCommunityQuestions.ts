import { useState, useCallback } from 'react';
import {
  CommunityQuestion,
  SortMode,
  getCommunityQuestions,
  voteCommunityQuestion,
  CommunityVoteType,
} from '../lib/communityQuestions';

export function useCommunityQuestions() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [sort, setSort] = useState<SortMode>('hot');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetch = useCallback(async (sortMode?: SortMode, reset = false) => {
    const s = sortMode ?? sort;
    if (sortMode && sortMode !== sort) setSort(sortMode);
    setLoading(true);

    const offset = reset ? 0 : questions.length;
    const data = await getCommunityQuestions(s, PAGE_SIZE, reset ? 0 : offset);

    if (reset) {
      setQuestions(data);
    } else {
      setQuestions((prev) => [...prev, ...data]);
    }
    setHasMore(data.length >= PAGE_SIZE);
    setLoading(false);
  }, [sort, questions.length]);

  const changeSort = useCallback((s: SortMode) => {
    fetch(s, true);
  }, [fetch]);

  const vote = useCallback(async (questionId: string, voteType: CommunityVoteType) => {
    const result = await voteCommunityQuestion(questionId, voteType);
    if (result.success) {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          // Optimistic update
          const wasUp = q.user_vote === 'up';
          const wasDown = q.user_vote === 'down';
          let upvotes = q.upvotes;
          let downvotes = q.downvotes;
          if (wasUp) upvotes--;
          if (wasDown) downvotes--;
          if (voteType === 'up') upvotes++;
          if (voteType === 'down') downvotes++;
          return { ...q, upvotes, downvotes, user_vote: voteType };
        })
      );
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetch(sort, false);
  }, [loading, hasMore, fetch, sort]);

  const refresh = useCallback(() => fetch(sort, true), [fetch, sort]);

  return {
    questions,
    sort,
    loading,
    hasMore,
    changeSort,
    vote,
    loadMore,
    refresh,
  };
}
