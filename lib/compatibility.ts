import { CONTENT_AXES, BEHAVIORAL_AXES } from './personality-constants';
import type { PersonalityAxes, ContentAxes } from './personality';
import type { DatingProfile } from './personality-scoring';

export type CompatibilityProfile = PersonalityAxes & Partial<ContentAxes>;

export interface CompatibilityResult {
  overallScore: number;
  axisScores: Record<string, number>;
  label: CompatibilityLabel;
  commonGround: string[];
  differences: string[];
  datingScore?: number | null;
}

export type CompatibilityLabel = 'soulmate' | 'veryCompatible' | 'compatible' | 'different' | 'opposite';

const AXIS_LABEL_KEYS: Record<string, string> = {
  conformity: 'personalityConformity',
  speed: 'personalitySpeed',
  diversity: 'personalityDiversity',
  courage: 'personalityCourage',
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

const AXIS_WEIGHTS: Record<string, number> = {
  conformity: 0.08,
  speed: 0.05,
  diversity: 0.07,
  courage: 0.05,
  risk_tolerance: 0.08,
  novelty_seeking: 0.08,
  social_energy: 0.07,
  independence: 0.07,
  emotionality: 0.07,
  practicality: 0.07,
  commitment_readiness: 0.07,
  communication_directness: 0.07,
  conflict_style: 0.06,
  romance_style: 0.06,
  chaos_tolerance: 0.05,
};

const COMPLEMENTARY_PAIRS: Array<{ axis: string; bonus: number }> = [
  { axis: 'courage', bonus: 4 },
  { axis: 'independence', bonus: 4 },
  { axis: 'speed', bonus: 2 },
];

function axisValue(profile: CompatibilityProfile, axis: string): number | null {
  const val = (profile as unknown as Record<string, number | undefined>)[axis];
  return val == null ? null : val;
}

export function flattenFriendAxes(raw: Record<string, unknown> | null): CompatibilityProfile | null {
  if (!raw) return null;
  const content = (raw.content_axes as Partial<ContentAxes>) ?? {};
  return {
    conformity: (raw.conformity as number) ?? 50,
    speed: (raw.speed as number) ?? 50,
    diversity: (raw.diversity as number) ?? 50,
    courage: (raw.courage as number) ?? 50,
    ...content,
  };
}

export function calculateCompatibility(
  myAxes: CompatibilityProfile,
  theirAxes: CompatibilityProfile,
): CompatibilityResult {
  const allAxes = [...BEHAVIORAL_AXES, ...CONTENT_AXES];
  const axisScores: Record<string, number> = {};

  let weightedSum = 0;
  let weightTotal = 0;

  for (const axis of allAxes) {
    const myVal = axisValue(myAxes, axis);
    const theirVal = axisValue(theirAxes, axis);
    if (myVal == null && theirVal == null) continue;

    const a = myVal ?? 50;
    const b = theirVal ?? 50;
    const similarity = 100 - Math.abs(a - b);
    axisScores[axis] = similarity;
    const w = AXIS_WEIGHTS[axis] ?? 0.05;
    weightedSum += similarity * w;
    weightTotal += w;
  }

  if (weightTotal === 0) {
    return {
      overallScore: 50,
      axisScores,
      label: 'compatible',
      commonGround: [],
      differences: [],
    };
  }

  let complementaryBonus = 0;
  for (const { axis, bonus } of COMPLEMENTARY_PAIRS) {
    const myVal = axisValue(myAxes, axis);
    const theirVal = axisValue(theirAxes, axis);
    if (myVal == null || theirVal == null) continue;
    const distance = Math.abs(myVal - theirVal);
    if (distance > 50) {
      complementaryBonus += bonus * (distance - 50) / 50;
    }
  }

  const overallScore = Math.round(
    Math.max(0, Math.min(100, (weightedSum / weightTotal) + complementaryBonus)),
  );

  const SIMILARITY_THRESHOLD = 70;
  const DIFFERENCE_THRESHOLD = 40;
  const commonGround: string[] = [];
  const differences: string[] = [];

  for (const axis of allAxes) {
    if (axisScores[axis] >= SIMILARITY_THRESHOLD) {
      commonGround.push(AXIS_LABEL_KEYS[axis]);
    } else if (axisScores[axis] <= DIFFERENCE_THRESHOLD) {
      differences.push(AXIS_LABEL_KEYS[axis]);
    }
  }

  return {
    overallScore,
    axisScores,
    label: getCompatibilityLabel(overallScore),
    commonGround,
    differences,
  };
}

export function calculateDatingCompatibility(
  myDating: DatingProfile | null | undefined,
  theirDating: DatingProfile | null | undefined,
): number | null {
  if (!myDating?.unlocked || !theirDating?.unlocked) return null;
  const dims = ['togetherness', 'dating_pace'] as const;
  let sum = 0;
  for (const dim of dims) {
    const a = (myDating[dim] as number) ?? 50;
    const b = (theirDating[dim] as number) ?? 50;
    sum += 100 - Math.abs(a - b);
  }
  return Math.round(sum / dims.length);
}

function getCompatibilityLabel(score: number): CompatibilityLabel {
  if (score >= 85) return 'soulmate';
  if (score >= 70) return 'veryCompatible';
  if (score >= 50) return 'compatible';
  if (score >= 30) return 'different';
  return 'opposite';
}

const LABEL_KEYS: Record<CompatibilityLabel, string> = {
  soulmate: 'soulmate',
  veryCompatible: 'veryCompatible',
  compatible: 'compatibleLabel',
  different: 'differentPaths',
  opposite: 'opposites',
};

export function getCompatibilityLabelKey(label: CompatibilityLabel): string {
  return LABEL_KEYS[label];
}
