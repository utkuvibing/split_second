import type {
  BehavioralAxis,
  ContentAxis,
  DatingDimension,
} from './personality-constants';
import {
  BEHAVIORAL_AXES,
  CONTENT_AXES,
  CONTENT_AXIS_COVERAGE_TARGET,
  DATING_AXIS_COVERAGE_TARGET,
  DATING_CONFIDENCE_FULL_VOTES,
  DATING_PROFILE_UNLOCK_VOTES,
  CONTENT_AXES_UNLOCK_VOTES,
  DIVERSITY_CATEGORY_COUNT,
  PERSONALITY_UNLOCK_VOTES,
} from './personality-constants';
import typeWeights from './personality-types-v2.json';

export interface BehavioralContext {
  total_votes: number;
  majority_count: number;
  avg_vote_time: number;
  unique_categories: number;
  minority_in_skewed: number;
  skewed_questions: number;
}

export interface QuestionSignalEntry {
  schema_version?: number;
  category: string;
  a: Record<string, number>;
  b: Record<string, number>;
  dating?: {
    a: Record<string, string | number>;
    b: Record<string, string | number>;
  };
}

export interface VoteSignalRow {
  choice: 'a' | 'b';
  category: string;
  personality_signals: QuestionSignalEntry;
}

export interface AxisScores {
  behavioral: Record<BehavioralAxis, number>;
  content: Record<ContentAxis, number>;
}

export interface AxisConfidence {
  behavioral: Record<BehavioralAxis, number>;
  content: Record<ContentAxis, number>;
}

export interface DatingProfile {
  attachment_style: string;
  dating_pace: number;
  communication_style: string;
  conflict_style: string;
  romance_style: string;
  privacy_style: string;
  togetherness: number;
  confidence: number;
  unlocked: boolean;
  votes_count: number;
}

export interface PersonalityProfileV2 {
  model_version: number;
  personality_type: string;
  behavioral_axes: Record<BehavioralAxis, number>;
  content_axes: Record<ContentAxis, number>;
  axis_confidence: AxisConfidence;
  dating_profile: DatingProfile | null;
  total_votes: number;
  votes_analyzed: number;
  content_unlocked: boolean;
  dating_unlocked: boolean;
}

export interface SignalAggregation {
  content_raw: Record<string, number>;
  content_theoretical_max: Record<string, number>;
  content_coverage: Record<string, number>;
  dating_votes_count: number;
  dating_enum_scores: Record<string, Record<string, number>>;
  dating_pace_raw: number;
  dating_pace_max: number;
  togetherness_raw: number;
  togetherness_max: number;
}

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeBehavioralAxes(ctx: BehavioralContext): Record<BehavioralAxis, number> {
  const conformity = ctx.total_votes > 0
    ? Math.round((ctx.majority_count / ctx.total_votes) * 100)
    : 50;

  const clampedTime = Math.max(0, Math.min(10, ctx.avg_vote_time));
  const speed = Math.round((1 - clampedTime / 10) * 100);

  const diversity = Math.min(
    100,
    Math.round((ctx.unique_categories / DIVERSITY_CATEGORY_COUNT) * 100),
  );

  const courage = ctx.skewed_questions > 0
    ? Math.round((ctx.minority_in_skewed / ctx.skewed_questions) * 100)
    : 50;

  return {
    conformity: clamp100(conformity),
    speed: clamp100(speed),
    diversity: clamp100(diversity),
    courage: clamp100(courage),
  };
}

function mergeSignalMaps(
  target: Record<string, number>,
  source: Record<string, number> | undefined,
  sign = 1,
): void {
  if (!source) return;
  for (const [key, val] of Object.entries(source)) {
    if (typeof val !== 'number') continue;
    target[key] = (target[key] ?? 0) + sign * val;
  }
}

function maxAbsPerAxis(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out: Record<string, number> = {};
  for (const key of keys) {
    out[key] = Math.max(Math.abs(a[key] ?? 0), Math.abs(b[key] ?? 0));
  }
  return out;
}

export function aggregateVoteSignals(rows: VoteSignalRow[]): SignalAggregation {
  const content_raw: Record<string, number> = {};
  const content_theoretical_max: Record<string, number> = {};
  const content_coverage: Record<string, number> = {};
  const dating_enum_scores: Record<string, Record<string, number>> = {};
  let dating_votes_count = 0;
  let dating_pace_raw = 0;
  let dating_pace_max = 0;
  let togetherness_raw = 0;
  let togetherness_max = 0;

  for (const row of rows) {
    const sig = row.personality_signals;
    if (!sig) continue;

    const choiceSignals = row.choice === 'a' ? sig.a : sig.b;
    mergeSignalMaps(content_raw, choiceSignals);

    const perQuestionMax = maxAbsPerAxis(sig.a ?? {}, sig.b ?? {});
    for (const [axis, maxVal] of Object.entries(perQuestionMax)) {
      content_theoretical_max[axis] = (content_theoretical_max[axis] ?? 0) + maxVal;
      if (maxVal > 0) {
        content_coverage[axis] = (content_coverage[axis] ?? 0) + 1;
      }
    }

    if (row.category === 'dating' && sig.dating) {
      dating_votes_count += 1;
      const datingChoice = row.choice === 'a' ? sig.dating.a : sig.dating.b;
      for (const [dim, val] of Object.entries(datingChoice)) {
        if (dim === 'dating_pace' && typeof val === 'number') {
          dating_pace_raw += val;
          dating_pace_max += 2;
        } else if (dim === 'togetherness' && typeof val === 'number') {
          togetherness_raw += val;
          togetherness_max += 2;
        } else if (typeof val === 'string') {
          if (!dating_enum_scores[dim]) dating_enum_scores[dim] = {};
          dating_enum_scores[dim][val] = (dating_enum_scores[dim][val] ?? 0) + 1;
        }
      }
      const indepA = sig.a.independence ?? 0;
      const indepB = sig.b.independence ?? 0;
      togetherness_max += Math.max(Math.abs(indepA), Math.abs(indepB));
      if (row.choice === 'a') togetherness_raw -= indepA;
      else togetherness_raw -= indepB;
    }
  }

  return {
    content_raw,
    content_theoretical_max,
    content_coverage,
    dating_votes_count,
    dating_enum_scores,
    dating_pace_raw,
    dating_pace_max,
    togetherness_raw,
    togetherness_max,
  };
}

export function normalizeContentAxes(
  agg: SignalAggregation,
): { axes: Record<ContentAxis, number>; confidence: Record<ContentAxis, number> } {
  const axes = {} as Record<ContentAxis, number>;
  const confidence = {} as Record<ContentAxis, number>;

  for (const axis of CONTENT_AXES) {
    const raw = agg.content_raw[axis] ?? 0;
    const max = Math.max(agg.content_theoretical_max[axis] ?? 0, 1);
    const coverage = agg.content_coverage[axis] ?? 0;
    const normalized = 50 + 50 * (raw / max);
    const conf = Math.min(1, coverage / CONTENT_AXIS_COVERAGE_TARGET);
    axes[axis] = clamp100(50 + (normalized - 50) * conf);
    confidence[axis] = conf;
  }

  return { axes, confidence };
}

function pickTopEnum(scores: Record<string, number> | undefined, fallback: string): string {
  if (!scores || Object.keys(scores).length === 0) return fallback;
  let best = fallback;
  let bestScore = -Infinity;
  for (const [key, val] of Object.entries(scores)) {
    if (val > bestScore) {
      bestScore = val;
      best = key;
    }
  }
  return best;
}

export function buildDatingProfile(agg: SignalAggregation): DatingProfile | null {
  const votes = agg.dating_votes_count;
  if (votes === 0) {
    return null;
  }

  const confidence = Math.min(1, votes / DATING_CONFIDENCE_FULL_VOTES);
  const unlocked = votes >= DATING_PROFILE_UNLOCK_VOTES && confidence >= 0.5;

  const paceNorm = agg.dating_pace_max > 0
    ? 50 + 50 * (agg.dating_pace_raw / agg.dating_pace_max)
    : 50;
  const togetherNorm = agg.togetherness_max > 0
    ? clamp100(50 + 50 * (agg.togetherness_raw / agg.togetherness_max))
    : 50;

  return {
    attachment_style: pickTopEnum(agg.dating_enum_scores.attachment_style, 'mixed'),
    dating_pace: clamp100(50 + (paceNorm - 50) * confidence),
    communication_style: pickTopEnum(agg.dating_enum_scores.communication_style, 'balanced'),
    conflict_style: pickTopEnum(agg.dating_enum_scores.conflict_style, 'harmonizer'),
    romance_style: pickTopEnum(agg.dating_enum_scores.romance_style, 'steady'),
    privacy_style: pickTopEnum(agg.dating_enum_scores.privacy_style, 'balanced'),
    togetherness: clamp100(50 + (togetherNorm - 50) * confidence),
    confidence,
    unlocked,
    votes_count: votes,
  };
}

function resolveWeightValue(
  key: string,
  behavioral: Record<BehavioralAxis, number>,
  content: Record<ContentAxis, number>,
): number {
  if (key.endsWith('_inv')) {
    const base = key.slice(0, -4) as BehavioralAxis | ContentAxis;
    if (base in behavioral) {
      return 100 - behavioral[base as BehavioralAxis];
    }
    if (CONTENT_AXES.includes(base as ContentAxis)) {
      return 100 - content[base as ContentAxis];
    }
  }
  if (BEHAVIORAL_AXES.includes(key as BehavioralAxis)) {
    return behavioral[key as BehavioralAxis];
  }
  if (CONTENT_AXES.includes(key as ContentAxis)) {
    return content[key as ContentAxis];
  }
  return 50;
}

export function determinePersonalityTypeV2(
  behavioral: Record<BehavioralAxis, number>,
  content: Record<ContentAxis, number>,
): string {
  let bestId = 'flash_rebel';
  let bestScore = -Infinity;

  for (const typeDef of typeWeights.types) {
    let score = 0;
    for (const [key, weight] of Object.entries(typeDef.weights)) {
      score += resolveWeightValue(key, behavioral, content) * weight;
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = typeDef.id;
    }
  }

  return bestId;
}

export function computePersonalityProfileV2(
  behavioralCtx: BehavioralContext,
  signalRows: VoteSignalRow[],
  existingType?: string,
  existingVotesAnalyzed?: number,
): PersonalityProfileV2 {
  const total_votes = behavioralCtx.total_votes;
  const behavioral_axes = computeBehavioralAxes(behavioralCtx);
  const agg = aggregateVoteSignals(signalRows);
  const { axes: content_axes, confidence: content_confidence } = normalizeContentAxes(agg);

  const behavioral_confidence = {} as Record<BehavioralAxis, number>;
  for (const axis of BEHAVIORAL_AXES) {
    behavioral_confidence[axis] = total_votes >= PERSONALITY_UNLOCK_VOTES ? 1 : 0;
  }

  const personality_type = total_votes >= PERSONALITY_UNLOCK_VOTES
    ? determinePersonalityTypeV2(behavioral_axes, content_axes)
    : (existingType ?? 'unknown');

  const dating_profile = buildDatingProfile(agg);
  const content_unlocked = total_votes >= CONTENT_AXES_UNLOCK_VOTES;
  const dating_unlocked = (dating_profile?.unlocked ?? false) && (dating_profile?.confidence ?? 0) >= 0.5;

  return {
    model_version: 2,
    personality_type,
    behavioral_axes,
    content_axes,
    axis_confidence: {
      behavioral: behavioral_confidence,
      content: content_confidence,
    },
    dating_profile,
    total_votes,
    votes_analyzed: total_votes,
    content_unlocked,
    dating_unlocked,
  };
}

export function shouldRefreshPersonalityV2(
  totalVotes: number,
  votesAnalyzed: number,
  currentType: string,
  modelVersion: number | null | undefined,
): boolean {
  if (totalVotes < PERSONALITY_UNLOCK_VOTES) return false;
  if (modelVersion == null || modelVersion < 2) return true;
  if (currentType === 'unknown' || votesAnalyzed === 0) return true;
  return totalVotes > votesAnalyzed;
}

export function isFirstPersonalityUnlockV2(
  currentType: string,
  votesAnalyzed: number,
  modelVersion: number | null | undefined,
): boolean {
  if (modelVersion == null || modelVersion < 2) {
    return currentType === 'unknown' || votesAnalyzed === 0;
  }
  return currentType === 'unknown' || votesAnalyzed === 0;
}
