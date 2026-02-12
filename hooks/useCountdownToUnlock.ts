import { useState, useEffect, useCallback } from 'react';
import { TimeSlot } from '../types/database';
import { getSecondsUntilUnlock } from '../lib/questions';

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useCountdownToUnlock(timeSlot: TimeSlot | null) {
  const getSeconds = useCallback(() => {
    if (!timeSlot) return 0;
    return getSecondsUntilUnlock(timeSlot);
  }, [timeSlot]);

  const [secondsLeft, setSecondsLeft] = useState(getSeconds);

  useEffect(() => {
    setSecondsLeft(getSeconds());
    const interval = setInterval(() => {
      const s = getSeconds();
      setSecondsLeft(s);
    }, 1000);

    return () => clearInterval(interval);
  }, [getSeconds]);

  return {
    secondsLeft,
    formatted: formatTime(secondsLeft),
    isUnlocked: secondsLeft <= 0,
  };
}
