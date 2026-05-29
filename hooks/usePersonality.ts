import { useState, useEffect, useCallback } from 'react';
import {
  PersonalityType,
  PersonalityAxes,
  ContentAxes,
  PersonalityContextV2,
  PersonalityRecalcResult,
  DatingProfile,
  AxisConfidence,
  PERSONALITY_UNLOCK_VOTES,
  fetchPersonalityContext,
  refreshPersonality,
  getPersonalityById,
  shouldRecalculatePersonality,
  isFirstPersonalityUnlock,
} from '../lib/personality';

interface UsePersonalityResult {
  personality: PersonalityType | null;
  axes: PersonalityAxes | null;
  contentAxes: Partial<ContentAxes> | null;
  axisConfidence: AxisConfidence | null;
  datingProfile: DatingProfile | null;
  totalVotes: number;
  isUnlocked: boolean;
  contentUnlocked: boolean;
  contentReady: boolean;
  behavioralReady: boolean;
  datingUnlocked: boolean;
  datingVotesCount: number;
  votesRemaining: number;
  loading: boolean;
  isFirstReveal: boolean;
  recalculate: () => Promise<PersonalityRecalcResult | null>;
}

function applyContextToState(
  ctx: PersonalityContextV2,
  setters: {
    setTotalVotes: (n: number) => void;
    setPersonality: (p: PersonalityType | null) => void;
    setAxes: (a: PersonalityAxes | null) => void;
    setContentAxes: (c: Partial<ContentAxes> | null) => void;
    setAxisConfidence: (c: AxisConfidence | null) => void;
    setDatingProfile: (d: DatingProfile | null) => void;
    setContentUnlocked: (b: boolean) => void;
    setContentReady: (b: boolean) => void;
    setBehavioralReady: (b: boolean) => void;
    setDatingUnlocked: (b: boolean) => void;
    setDatingVotesCount: (n: number) => void;
  },
): PersonalityType | null {
  setters.setTotalVotes(ctx.total_votes);
  setters.setAxes(ctx.behavioral_ready ? ctx.behavioral_axes : null);
  setters.setContentAxes(ctx.content_ready ? ctx.content_axes : null);
  setters.setAxisConfidence(ctx.axis_confidence ?? null);
  setters.setDatingProfile(ctx.dating_profile);
  setters.setContentUnlocked(ctx.content_unlocked);
  setters.setContentReady(ctx.content_ready);
  setters.setBehavioralReady(ctx.behavioral_ready);
  setters.setDatingUnlocked(ctx.dating_unlocked);
  setters.setDatingVotesCount(ctx.dating_votes_count);

  if (ctx.total_votes < PERSONALITY_UNLOCK_VOTES) {
    setters.setPersonality(null);
    return null;
  }

  const type = getPersonalityById(ctx.personality_type);
  setters.setPersonality(type ?? null);
  return type ?? null;
}

export function usePersonality(): UsePersonalityResult {
  const [personality, setPersonality] = useState<PersonalityType | null>(null);
  const [axes, setAxes] = useState<PersonalityAxes | null>(null);
  const [contentAxes, setContentAxes] = useState<Partial<ContentAxes> | null>(null);
  const [axisConfidence, setAxisConfidence] = useState<AxisConfidence | null>(null);
  const [datingProfile, setDatingProfile] = useState<DatingProfile | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [behavioralReady, setBehavioralReady] = useState(false);
  const [datingUnlocked, setDatingUnlocked] = useState(false);
  const [datingVotesCount, setDatingVotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFirstReveal, setIsFirstReveal] = useState(false);

  const isUnlocked = totalVotes >= PERSONALITY_UNLOCK_VOTES;
  const votesRemaining = Math.max(0, PERSONALITY_UNLOCK_VOTES - totalVotes);

  const setters = {
    setTotalVotes,
    setPersonality,
    setAxes,
    setContentAxes,
    setAxisConfidence,
    setDatingProfile,
    setContentUnlocked,
    setContentReady,
    setBehavioralReady,
    setDatingUnlocked,
    setDatingVotesCount,
  };

  const applyContext = useCallback(async (ctx: PersonalityContextV2): Promise<PersonalityRecalcResult | null> => {
    const wasFirstUnlock = isFirstPersonalityUnlock(ctx);
    let activeCtx = ctx;

    if (shouldRecalculatePersonality(ctx)) {
      const refreshed = await refreshPersonality();
      if (refreshed) activeCtx = refreshed;
    }

    const type = applyContextToState(activeCtx, setters);
    if (wasFirstUnlock && type) {
      setIsFirstReveal(true);
      return { type, isFirstReveal: true };
    }
    return type ? { type, isFirstReveal: false } : null;
  }, []);

  const load = useCallback(async () => {
    try {
      const ctx = await fetchPersonalityContext();
      if (ctx) await applyContext(ctx);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [applyContext]);

  useEffect(() => {
    load();
  }, [load]);

  const recalculate = useCallback(async (): Promise<PersonalityRecalcResult | null> => {
    try {
      const ctx = await fetchPersonalityContext();
      if (!ctx) return null;
      return applyContext(ctx);
    } catch {
      return null;
    }
  }, [applyContext]);

  return {
    personality,
    axes,
    contentAxes,
    axisConfidence,
    datingProfile,
    totalVotes,
    isUnlocked,
    contentUnlocked,
    contentReady,
    behavioralReady,
    datingUnlocked,
    datingVotesCount,
    votesRemaining,
    loading,
    isFirstReveal,
    recalculate,
  };
}
