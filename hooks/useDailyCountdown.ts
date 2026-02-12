import { useState, useEffect } from 'react';
import { TimeSlot } from '../types/database';
import { getSecondsUntilUnlock } from '../lib/questions';

const SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];

function getSecondsUntilMidnightLocal(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

function getNextCountdown(): { secondsLeft: number; label: 'next_question' | 'next_day' } {
  // Find the next locked slot
  for (const slot of SLOTS) {
    const seconds = getSecondsUntilUnlock(slot);
    if (seconds > 0) {
      return { secondsLeft: seconds, label: 'next_question' };
    }
  }
  // All slots unlocked, count to midnight for tomorrow's questions
  return { secondsLeft: getSecondsUntilMidnightLocal(), label: 'next_day' };
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useDailyCountdown() {
  const [state, setState] = useState(getNextCountdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getNextCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    secondsLeft: state.secondsLeft,
    formatted: formatTime(state.secondsLeft),
    label: state.label,
  };
}
