import { supabase } from './supabase';
import { Question, TimeSlot } from '../types/database';

const UNLOCK_HOURS: Record<TimeSlot, number> = {
  morning: 8,
  afternoon: 14,
  evening: 20,
};

export async function getTodayQuestions(): Promise<Question[]> {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('scheduled_date', today)
    .eq('is_active', true)
    .order('time_slot', { ascending: true });

  if (error) {
    console.error('Error fetching questions:', error.message);
    return [];
  }

  return (data as Question[]) ?? [];
}

/** Check if a question's time slot is unlocked based on device local time */
export function isQuestionUnlocked(timeSlot: TimeSlot): boolean {
  const localHour = new Date().getHours();
  return localHour >= UNLOCK_HOURS[timeSlot];
}

/** Get seconds until a time slot unlocks */
export function getSecondsUntilUnlock(timeSlot: TimeSlot): number {
  const now = new Date();
  const unlockHour = UNLOCK_HOURS[timeSlot];
  const localHour = now.getHours();
  const localMinute = now.getMinutes();
  const localSecond = now.getSeconds();

  if (localHour >= unlockHour) return 0;

  const currentSeconds = localHour * 3600 + localMinute * 60 + localSecond;
  const unlockSeconds = unlockHour * 3600;
  return unlockSeconds - currentSeconds;
}

/** Get the unlock hour for display */
export function getUnlockHour(timeSlot: TimeSlot): number {
  return UNLOCK_HOURS[timeSlot];
}

// Keep backward compatibility - returns the first available question
export async function getTodayQuestion(): Promise<Question | null> {
  const questions = await getTodayQuestions();
  return questions.length > 0 ? questions[0] : null;
}
