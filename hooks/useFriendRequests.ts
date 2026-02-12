import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import {
  FriendRequest,
  getPendingRequests,
  respondToRequest,
} from '../lib/friendRequests';

export function useFriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    const data = await getPendingRequests();
    setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Poll on app focus
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchRequests();
    });
    return () => sub.remove();
  }, [fetchRequests]);

  const accept = useCallback(async (requestId: string) => {
    const result = await respondToRequest(requestId, true);
    if (result.success) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
    return result.success;
  }, []);

  const reject = useCallback(async (requestId: string) => {
    const result = await respondToRequest(requestId, false);
    if (result.success) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
    return result.success;
  }, []);

  return {
    requests,
    pendingCount: requests.length,
    loading,
    accept,
    reject,
    refetch: fetchRequests,
  };
}
