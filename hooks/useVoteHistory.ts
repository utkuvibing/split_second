import { useState, useEffect } from 'react';
import { VoteHistoryItem, getVoteHistory } from '../lib/history';
import { localizeQuestion } from '../lib/i18n';

export function useVoteHistory() {
  const [history, setHistory] = useState<VoteHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getVoteHistory();
    setHistory(data.map(localizeQuestion));
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { history, loading, refetch: fetch };
}
