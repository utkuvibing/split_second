import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveEvent,
  getLiveEvent,
  submitLiveVote,
  subscribeLiveVotes,
} from '../lib/liveEvents';

export function useLiveEvent() {
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const unsubRef = useRef<(() => void) | null>(null);

  const fetchEvent = useCallback(async () => {
    const data = await getLiveEvent();
    setEvent(data);
    if (data.has_event) {
      setCountA(data.count_a ?? 0);
      setCountB(data.count_b ?? 0);
      setUserChoice(data.user_choice ?? null);
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Subscribe to real-time votes when event is active
  useEffect(() => {
    if (!event?.has_event || event.status !== 'active' || !event.id) return;

    const unsub = subscribeLiveVotes(event.id, (choice) => {
      if (choice === 'a') setCountA((prev) => prev + 1);
      if (choice === 'b') setCountB((prev) => prev + 1);
    });
    unsubRef.current = unsub;

    return () => {
      unsub();
      unsubRef.current = null;
    };
  }, [event?.id, event?.status]);

  // Countdown: time remaining
  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    if (!event?.ends_at) return;
    const update = () => {
      const remaining = Math.max(0, new Date(event.ends_at!).getTime() - Date.now());
      setTimeRemaining(Math.floor(remaining / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event?.ends_at]);

  const vote = useCallback(async (choice: 'a' | 'b') => {
    if (!event?.id) return false;
    const result = await submitLiveVote(event.id, choice);
    if (result.success) {
      setUserChoice(choice);
      if (result.count_a != null) setCountA(result.count_a);
      if (result.count_b != null) setCountB(result.count_b);
      setCoinsEarned(result.coins_earned ?? 0);
      return true;
    }
    return false;
  }, [event?.id]);

  return {
    event,
    loading,
    countA,
    countB,
    userChoice,
    timeRemaining,
    coinsEarned,
    vote,
    refetch: fetchEvent,
  };
}
