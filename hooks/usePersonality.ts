import { useState, useEffect, useCallback } from 'react';
import {
  PersonalityType,
  PersonalityAxes,
  PERSONALITY_UNLOCK_VOTES,
  fetchPersonalityContext,
  calculateAxes,
  determineType,
  savePersonality,
  getPersonalityById,
} from '../lib/personality';

interface UsePersonalityResult {
  /** Current personality type (null if not enough votes) */
  personality: PersonalityType | null;
  /** Calculated axes scores */
  axes: PersonalityAxes | null;
  /** Total votes analyzed */
  totalVotes: number;
  /** Whether personality is unlocked (>= 7 votes) */
  isUnlocked: boolean;
  /** Votes remaining to unlock */
  votesRemaining: number;
  /** Loading state */
  loading: boolean;
  /** Whether this is a first-time reveal (type just changed from unknown) */
  isFirstReveal: boolean;
  /** Recalculate and save personality */
  recalculate: () => Promise<PersonalityType | null>;
}

export function usePersonality(): UsePersonalityResult {
  const [personality, setPersonality] = useState<PersonalityType | null>(null);
  const [axes, setAxes] = useState<PersonalityAxes | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFirstReveal, setIsFirstReveal] = useState(false);

  const isUnlocked = totalVotes >= PERSONALITY_UNLOCK_VOTES;
  const votesRemaining = Math.max(0, PERSONALITY_UNLOCK_VOTES - totalVotes);

  const load = useCallback(async () => {
    try {
      const ctx = await fetchPersonalityContext();
      if (!ctx) {
        setLoading(false);
        return;
      }

      setTotalVotes(ctx.total_votes);

      if (ctx.total_votes >= PERSONALITY_UNLOCK_VOTES) {
        if (ctx.current_type !== 'unknown' && ctx.votes_analyzed > 0) {
          // Already calculated - load existing
          const existing = getPersonalityById(ctx.current_type);
          setPersonality(existing ?? null);
          // Recalculate axes locally for display
          const calculatedAxes = calculateAxes(ctx);
          setAxes(calculatedAxes);
        } else {
          // First time unlocking - calculate now
          const calculatedAxes = calculateAxes(ctx);
          const type = determineType(calculatedAxes);
          setAxes(calculatedAxes);
          setPersonality(type);
          setIsFirstReveal(true);
          // Save to server
          await savePersonality(type.id, calculatedAxes, ctx.total_votes);
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const recalculate = useCallback(async (): Promise<PersonalityType | null> => {
    try {
      const ctx = await fetchPersonalityContext();
      if (!ctx || ctx.total_votes < PERSONALITY_UNLOCK_VOTES) return null;

      const calculatedAxes = calculateAxes(ctx);
      const type = determineType(calculatedAxes);
      setAxes(calculatedAxes);
      setPersonality(type);
      setTotalVotes(ctx.total_votes);
      await savePersonality(type.id, calculatedAxes, ctx.total_votes);
      return type;
    } catch {
      return null;
    }
  }, []);

  return {
    personality,
    axes,
    totalVotes,
    isUnlocked,
    votesRemaining,
    loading,
    isFirstReveal,
    recalculate,
  };
}
