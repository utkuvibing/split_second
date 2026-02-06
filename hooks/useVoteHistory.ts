import { useState, useEffect } from 'react';
import { VoteHistoryItem, getVoteHistory } from '../lib/history';
import { localizeQuestion } from '../lib/i18n';

export function useVoteHistory(limitDays?: number) {
  const [history, setHistory] = useState<VoteHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getVoteHistory(limitDays);
    setHistory(data.map(localizeQuestion));
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [limitDays]);

  return { history, loading, refetch: fetch };
}
