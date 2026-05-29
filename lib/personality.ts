import { supabase } from './supabase';
import {
  PERSONALITY_MODEL_VERSION,
  PERSONALITY_UNLOCK_VOTES,
  CONTENT_AXES_UNLOCK_VOTES,
  DATING_PROFILE_UNLOCK_VOTES,
  CONTENT_AXES,
  BEHAVIORAL_AXES,
  type ContentAxis,
  type BehavioralAxis,
} from './personality-constants';
import {
  shouldRefreshPersonalityV2,
  isFirstPersonalityUnlockV2,
  computeBehavioralAxes,
  determinePersonalityTypeV2,
  type DatingProfile,
  type AxisConfidence,
} from './personality-scoring';

export {
  PERSONALITY_UNLOCK_VOTES,
  CONTENT_AXES_UNLOCK_VOTES,
  DATING_PROFILE_UNLOCK_VOTES,
  PERSONALITY_MODEL_VERSION,
  CONTENT_AXES,
  BEHAVIORAL_AXES,
  type ContentAxis,
  type BehavioralAxis,
};
export type { DatingProfile, AxisConfidence };

export const DIVERSITY_CATEGORY_COUNT = 11;

export interface PersonalityRecalcResult {
  type: PersonalityType;
  isFirstReveal: boolean;
}

export interface PersonalityType {
  id: string;
  emoji: string;
  titleKeyTr: string;
  titleKeyEn: string;
  descKeyTr: string;
  descKeyEn: string;
}

export interface PersonalityAxes {
  conformity: number;
  speed: number;
  diversity: number;
  courage: number;
}

export interface ContentAxes {
  risk_tolerance: number;
  novelty_seeking: number;
  social_energy: number;
  independence: number;
  emotionality: number;
  practicality: number;
  commitment_readiness: number;
  communication_directness: number;
  conflict_style: number;
  romance_style: number;
  chaos_tolerance: number;
}

export interface PersonalityContextV2 {
  total_votes: number;
  votes_analyzed: number;
  model_version: number;
  current_type: string;
  personality_type: string;
  needs_refresh?: boolean;
  behavioral_axes: PersonalityAxes | null;
  behavioral_ready: boolean;
  content_axes: Partial<ContentAxes> | null;
  content_ready: boolean;
  axis_confidence?: AxisConfidence;
  dating_profile: DatingProfile | null;
  content_unlocked: boolean;
  dating_unlocked: boolean;
  dating_votes_count: number;
  v2_available: boolean;
}

export const PERSONALITY_TYPES: PersonalityType[] = [
  { id: 'flash_rebel', emoji: '\u26A1', titleKeyTr: 'personalityFlashRebelTitle', titleKeyEn: 'personalityFlashRebelTitle', descKeyTr: 'personalityFlashRebelDesc', descKeyEn: 'personalityFlashRebelDesc' },
  { id: 'cool_strategist', emoji: '\u265F\uFE0F', titleKeyTr: 'personalityCoolStrategistTitle', titleKeyEn: 'personalityCoolStrategistTitle', descKeyTr: 'personalityCoolStrategistDesc', descKeyEn: 'personalityCoolStrategistDesc' },
  { id: 'gut_feeler', emoji: '\uD83D\uDD25', titleKeyTr: 'personalityGutFeelerTitle', titleKeyEn: 'personalityGutFeelerTitle', descKeyTr: 'personalityGutFeelerDesc', descKeyEn: 'personalityGutFeelerDesc' },
  { id: 'lone_wolf', emoji: '\uD83D\uDC3A', titleKeyTr: 'personalityLoneWolfTitle', titleKeyEn: 'personalityLoneWolfTitle', descKeyTr: 'personalityLoneWolfDesc', descKeyEn: 'personalityLoneWolfDesc' },
  { id: 'explorer_soul', emoji: '\uD83E\uDDED', titleKeyTr: 'personalityExplorerSoulTitle', titleKeyEn: 'personalityExplorerSoulTitle', descKeyTr: 'personalityExplorerSoulDesc', descKeyEn: 'personalityExplorerSoulDesc' },
  { id: 'specialist_sage', emoji: '\uD83D\uDCDA', titleKeyTr: 'personalitySpecialistSageTitle', titleKeyEn: 'personalitySpecialistSageTitle', descKeyTr: 'personalitySpecialistSageDesc', descKeyEn: 'personalitySpecialistSageDesc' },
  { id: 'chaos_agent', emoji: '\uD83C\uDF00', titleKeyTr: 'personalityChaosAgentTitle', titleKeyEn: 'personalityChaosAgentTitle', descKeyTr: 'personalityChaosAgentDesc', descKeyEn: 'personalityChaosAgentDesc' },
  { id: 'wise_owl', emoji: '\uD83E\uDD89', titleKeyTr: 'personalityWiseOwlTitle', titleKeyEn: 'personalityWiseOwlTitle', descKeyTr: 'personalityWiseOwlDesc', descKeyEn: 'personalityWiseOwlDesc' },
];

export const CONTENT_AXIS_LABEL_KEYS: Record<ContentAxis, string> = {
  risk_tolerance: 'axisRiskTolerance',
  novelty_seeking: 'axisNoveltySeeking',
  social_energy: 'axisSocialEnergy',
  independence: 'axisIndependence',
  emotionality: 'axisEmotionality',
  practicality: 'axisPracticality',
  commitment_readiness: 'axisCommitmentReadiness',
  communication_directness: 'axisCommunicationDirectness',
  conflict_style: 'axisConflictStyle',
  romance_style: 'axisRomanceStyle',
  chaos_tolerance: 'axisChaosTolerance',
};

export function getPersonalityById(id: string): PersonalityType | undefined {
  return PERSONALITY_TYPES.find((p) => p.id === id);
}

function hasV1Metrics(data: Record<string, unknown>): boolean {
  return typeof data.majority_count === 'number' && typeof data.total_votes === 'number';
}

function axesFromV1Metrics(data: Record<string, unknown>): PersonalityAxes | null {
  if (!hasV1Metrics(data)) return null;
  const total = data.total_votes as number;
  if (total < PERSONALITY_UNLOCK_VOTES) return null;
  return computeBehavioralAxes({
    total_votes: total,
    majority_count: data.majority_count as number,
    avg_vote_time: (data.avg_vote_time as number) ?? 5,
    unique_categories: (data.unique_categories as number) ?? 0,
    minority_in_skewed: (data.minority_in_skewed as number) ?? 0,
    skewed_questions: (data.skewed_questions as number) ?? 0,
  });
}

function axesFromStored(data: Record<string, unknown>): PersonalityAxes | null {
  const raw = data.behavioral_axes as PersonalityAxes | undefined;
  if (!raw) return null;
  const votes = (data.votes_analyzed as number) ?? 0;
  const modelVersion = (data.model_version as number) ?? 1;
  if (votes < PERSONALITY_UNLOCK_VOTES) return null;
  const allZero = BEHAVIORAL_AXES.every((k) => (raw[k] ?? 0) === 0);
  if (allZero && modelVersion < 2 && !hasV1Metrics(data)) return null;
  return {
    conformity: raw.conformity ?? 0,
    speed: raw.speed ?? 0,
    diversity: raw.diversity ?? 0,
    courage: raw.courage ?? 0,
  };
}

function resolveBehavioralAxes(data: Record<string, unknown>): {
  axes: PersonalityAxes | null;
  ready: boolean;
} {
  const fromV1 = axesFromV1Metrics(data);
  if (fromV1) return { axes: fromV1, ready: true };

  const fromStored = axesFromStored(data);
  if (fromStored) {
    const allZero = BEHAVIORAL_AXES.every((k) => fromStored[k] === 0);
    if (allZero && hasV1Metrics(data)) {
      const fallback = axesFromV1Metrics(data);
      if (fallback) return { axes: fallback, ready: true };
    }
    return { axes: fromStored, ready: !allZero || (data.votes_analyzed as number) > 0 };
  }

  return { axes: null, ready: false };
}

function resolveContentState(
  data: Record<string, unknown>,
  v2Available: boolean,
): { axes: Partial<ContentAxes> | null; ready: boolean; unlocked: boolean } {
  const totalVotes = (data.total_votes as number) ?? 0;
  const unlocked = (data.content_unlocked as boolean) ?? totalVotes >= CONTENT_AXES_UNLOCK_VOTES;
  const raw = data.content_axes as Partial<ContentAxes> | null | undefined;
  const modelVersion = (data.model_version as number) ?? 1;

  if (!v2Available || modelVersion < 2 || !unlocked) {
    return { axes: null, ready: false, unlocked: false };
  }

  if (!raw || Object.keys(raw).length === 0) {
    return { axes: null, ready: false, unlocked };
  }

  return { axes: raw, ready: true, unlocked };
}

export function parsePersonalityContext(
  data: Record<string, unknown> | null | undefined,
  options: { v2Available?: boolean } = {},
): PersonalityContextV2 | null {
  if (!data || typeof data.total_votes !== 'number') return null;

  const v2Available = options.v2Available ?? (data.v2_available as boolean) ?? false;
  const { axes: behavioral_axes, ready: behavioral_ready } = resolveBehavioralAxes(data);
  const { axes: content_axes, ready: content_ready, unlocked: content_unlocked } =
    resolveContentState(data, v2Available);

  const datingProfile = (data.dating_profile as DatingProfile | null) ?? null;
  const datingUnlocked =
    (data.dating_unlocked as boolean) ??
    (datingProfile?.unlocked === true && (datingProfile.confidence ?? 0) >= 0.5);

  return {
    total_votes: data.total_votes as number,
    votes_analyzed: (data.votes_analyzed as number) ?? 0,
    model_version: (data.model_version as number) ?? 1,
    current_type: (data.current_type as string) ?? 'unknown',
    personality_type:
      (data.personality_type as string) ?? (data.current_type as string) ?? 'unknown',
    needs_refresh: data.needs_refresh as boolean | undefined,
    behavioral_axes,
    behavioral_ready,
    content_axes,
    content_ready,
    axis_confidence: data.axis_confidence as AxisConfidence | undefined,
    dating_profile: datingUnlocked ? datingProfile : datingProfile ? { ...datingProfile, unlocked: false } : null,
    content_unlocked,
    dating_unlocked: datingUnlocked,
    dating_votes_count: (data.dating_votes_count as number) ?? datingProfile?.votes_count ?? 0,
    v2_available: v2Available,
  };
}

export async function fetchPersonalityContext(): Promise<PersonalityContextV2 | null> {
  const v2 = await supabase.rpc('get_personality_context_v2');
  if (!v2.error && v2.data) {
    return parsePersonalityContext(v2.data as Record<string, unknown>, { v2Available: true });
  }

  const v1 = await supabase.rpc('get_personality_context');
  if (v1.error || !v1.data) return null;
  return parsePersonalityContext(v1.data as Record<string, unknown>, { v2Available: false });
}

export async function refreshPersonality(): Promise<PersonalityContextV2 | null> {
  const { data, error } = await supabase.rpc('refresh_personality_v2');
  if (error) return null;
  const parsed = parsePersonalityContext(data as Record<string, unknown>, { v2Available: true });
  if (parsed) return parsed;
  return fetchPersonalityContext();
}

export function shouldRecalculatePersonality(ctx: PersonalityContextV2): boolean {
  if (!ctx.v2_available) return false;
  return shouldRefreshPersonalityV2(
    ctx.total_votes,
    ctx.votes_analyzed,
    ctx.current_type,
    ctx.model_version,
  );
}

export function isFirstPersonalityUnlock(ctx: PersonalityContextV2): boolean {
  return isFirstPersonalityUnlockV2(ctx.current_type, ctx.votes_analyzed, ctx.model_version);
}

/** @deprecated Server computes and saves via refreshPersonality when v2 is available */
export async function savePersonality(): Promise<boolean> {
  const result = await refreshPersonality();
  return result != null;
}

export function calculateAxes(ctx: {
  total_votes: number;
  majority_count: number;
  avg_vote_time: number;
  unique_categories: number;
  minority_in_skewed: number;
  skewed_questions: number;
}): PersonalityAxes {
  return computeBehavioralAxes(ctx);
}

export function determineType(axes: PersonalityAxes): PersonalityType {
  const emptyContent = Object.fromEntries(CONTENT_AXES.map((a) => [a, 50])) as Record<ContentAxis, number>;
  const id = determinePersonalityTypeV2(axes, emptyContent);
  return getPersonalityById(id) ?? PERSONALITY_TYPES[0];
}

export function mergeAxesForDisplay(ctx: PersonalityContextV2): PersonalityAxes & Partial<ContentAxes> {
  return { ...(ctx.behavioral_axes ?? { conformity: 50, speed: 50, diversity: 50, courage: 50 }), ...ctx.content_axes };
}
