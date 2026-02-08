import { supabase } from './supabase';

export const PERSONALITY_UNLOCK_VOTES = 7;

export interface PersonalityType {
  id: string;
  emoji: string;
  titleKeyTr: string;
  titleKeyEn: string;
  descKeyTr: string;
  descKeyEn: string;
  /** Weighted scoring function: higher = better match */
  score: (axes: PersonalityAxes) => number;
}

export interface PersonalityAxes {
  conformity: number;  // 0-100, high = votes with majority
  speed: number;       // 0-100, high = fast voter
  diversity: number;   // 0-100, high = many categories
  courage: number;     // 0-100, high = picks minority in skewed
}

export interface PersonalityContext {
  total_votes: number;
  majority_count: number;
  avg_vote_time: number;
  unique_categories: number;
  minority_in_skewed: number;
  skewed_questions: number;
  current_type: string;
  votes_analyzed: number;
}

export interface SavedPersonality {
  type: string;
  axes: PersonalityAxes;
  votesAnalyzed: number;
}

// 8 Personality Types
export const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: 'flash_rebel',
    emoji: '\u26A1',
    titleKeyTr: 'personalityFlashRebelTitle',
    titleKeyEn: 'personalityFlashRebelTitle',
    descKeyTr: 'personalityFlashRebelDesc',
    descKeyEn: 'personalityFlashRebelDesc',
    score: (a) => a.speed * 0.4 + (100 - a.conformity) * 0.4 + a.courage * 0.2,
  },
  {
    id: 'cool_strategist',
    emoji: '\u265F\uFE0F',
    titleKeyTr: 'personalityCoolStrategistTitle',
    titleKeyEn: 'personalityCoolStrategistTitle',
    descKeyTr: 'personalityCoolStrategistDesc',
    descKeyEn: 'personalityCoolStrategistDesc',
    score: (a) => (100 - a.speed) * 0.4 + a.conformity * 0.4 + (100 - a.courage) * 0.2,
  },
  {
    id: 'gut_feeler',
    emoji: '\uD83D\uDD25',
    titleKeyTr: 'personalityGutFeelerTitle',
    titleKeyEn: 'personalityGutFeelerTitle',
    descKeyTr: 'personalityGutFeelerDesc',
    descKeyEn: 'personalityGutFeelerDesc',
    score: (a) => a.speed * 0.4 + a.conformity * 0.4 + (100 - a.diversity) * 0.2,
  },
  {
    id: 'lone_wolf',
    emoji: '\uD83D\uDC3A',
    titleKeyTr: 'personalityLoneWolfTitle',
    titleKeyEn: 'personalityLoneWolfTitle',
    descKeyTr: 'personalityLoneWolfDesc',
    descKeyEn: 'personalityLoneWolfDesc',
    score: (a) => (100 - a.speed) * 0.35 + (100 - a.conformity) * 0.35 + a.courage * 0.3,
  },
  {
    id: 'explorer_soul',
    emoji: '\uD83E\uDDED',
    titleKeyTr: 'personalityExplorerSoulTitle',
    titleKeyEn: 'personalityExplorerSoulTitle',
    descKeyTr: 'personalityExplorerSoulDesc',
    descKeyEn: 'personalityExplorerSoulDesc',
    score: (a) => a.diversity * 0.4 + a.courage * 0.35 + (100 - a.conformity) * 0.25,
  },
  {
    id: 'specialist_sage',
    emoji: '\uD83D\uDCDA',
    titleKeyTr: 'personalitySpecialistSageTitle',
    titleKeyEn: 'personalitySpecialistSageTitle',
    descKeyTr: 'personalitySpecialistSageDesc',
    descKeyEn: 'personalitySpecialistSageDesc',
    score: (a) => (100 - a.diversity) * 0.4 + (100 - a.courage) * 0.35 + a.conformity * 0.25,
  },
  {
    id: 'chaos_agent',
    emoji: '\uD83C\uDF00',
    titleKeyTr: 'personalityChaosAgentTitle',
    titleKeyEn: 'personalityChaosAgentTitle',
    descKeyTr: 'personalityChaosAgentDesc',
    descKeyEn: 'personalityChaosAgentDesc',
    score: (a) => a.speed * 0.3 + a.courage * 0.3 + a.diversity * 0.3 + (100 - a.conformity) * 0.1,
  },
  {
    id: 'wise_owl',
    emoji: '\uD83E\uDD89',
    titleKeyTr: 'personalityWiseOwlTitle',
    titleKeyEn: 'personalityWiseOwlTitle',
    descKeyTr: 'personalityWiseOwlDesc',
    descKeyEn: 'personalityWiseOwlDesc',
    score: (a) => (100 - a.speed) * 0.3 + a.conformity * 0.3 + (100 - a.diversity) * 0.2 + (100 - a.courage) * 0.2,
  },
];

export function getPersonalityById(id: string): PersonalityType | undefined {
  return PERSONALITY_TYPES.find((p) => p.id === id);
}

/** Calculate 4 axes from raw context data */
export function calculateAxes(ctx: PersonalityContext): PersonalityAxes {
  const conformity = ctx.total_votes > 0
    ? Math.round((ctx.majority_count / ctx.total_votes) * 100)
    : 50;

  // Speed: map avg vote time to 0-100 (0s=100, 10s+=0)
  const clampedTime = Math.max(0, Math.min(10, ctx.avg_vote_time));
  const speed = Math.round((1 - clampedTime / 10) * 100);

  // Diversity: unique categories / 10, capped at 100
  const diversity = Math.min(100, Math.round((ctx.unique_categories / 10) * 100));

  // Courage: minority picks in skewed questions
  const courage = ctx.skewed_questions > 0
    ? Math.round((ctx.minority_in_skewed / ctx.skewed_questions) * 100)
    : 50;

  return {
    conformity: Math.max(0, Math.min(100, conformity)),
    speed: Math.max(0, Math.min(100, speed)),
    diversity: Math.max(0, Math.min(100, diversity)),
    courage: Math.max(0, Math.min(100, courage)),
  };
}

/** Determine personality type from axes */
export function determineType(axes: PersonalityAxes): PersonalityType {
  let best = PERSONALITY_TYPES[0];
  let bestScore = -Infinity;

  for (const pt of PERSONALITY_TYPES) {
    const s = pt.score(axes);
    if (s > bestScore) {
      bestScore = s;
      best = pt;
    }
  }

  return best;
}

/** Fetch personality context from server */
export async function fetchPersonalityContext(): Promise<PersonalityContext | null> {
  const { data, error } = await supabase.rpc('get_personality_context');
  if (error) return null;
  return data as PersonalityContext;
}

/** Save calculated personality to server */
export async function savePersonality(
  type: string,
  axes: PersonalityAxes,
  votesAnalyzed: number
): Promise<boolean> {
  const { error } = await supabase.rpc('save_personality', {
    p_type: type,
    p_conformity: axes.conformity,
    p_speed: axes.speed,
    p_diversity: axes.diversity,
    p_courage: axes.courage,
    p_votes_analyzed: votesAnalyzed,
  });
  return !error;
}
