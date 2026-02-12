import { PersonalityAxes } from './personality';

export interface CompatibilityResult {
  overallScore: number;
  axisScores: {
    conformity: number;
    speed: number;
    diversity: number;
    courage: number;
  };
  label: CompatibilityLabel;
  commonGround: string[];
  differences: string[];
}

export type CompatibilityLabel = 'soulmate' | 'veryCompatible' | 'compatible' | 'different' | 'opposite';

const AXIS_NAMES: Record<keyof PersonalityAxes, string> = {
  conformity: 'personalityConformity',
  speed: 'personalitySpeed',
  diversity: 'personalityDiversity',
  courage: 'personalityCourage',
};

// Some axis pairings where differences can be complementary
const COMPLEMENTARY_PAIRS: Array<{ axis: keyof PersonalityAxes; bonus: number }> = [
  { axis: 'courage', bonus: 5 },
  { axis: 'speed', bonus: 3 },
];

const AXIS_WEIGHTS: Record<keyof PersonalityAxes, number> = {
  conformity: 0.3,
  speed: 0.2,
  diversity: 0.25,
  courage: 0.25,
};

/**
 * Calculate deep compatibility between two personality profiles.
 * Returns overall score (0-100), per-axis scores, labels, and analysis.
 */
export function calculateCompatibility(
  myAxes: PersonalityAxes,
  theirAxes: PersonalityAxes
): CompatibilityResult {
  const axes = ['conformity', 'speed', 'diversity', 'courage'] as const;

  // Per-axis similarity (100 = identical, 0 = opposite ends)
  const axisScores = {
    conformity: 100 - Math.abs(myAxes.conformity - theirAxes.conformity),
    speed: 100 - Math.abs(myAxes.speed - theirAxes.speed),
    diversity: 100 - Math.abs(myAxes.diversity - theirAxes.diversity),
    courage: 100 - Math.abs(myAxes.courage - theirAxes.courage),
  };

  // Weighted average of axis similarities
  let weightedSum = 0;
  for (const axis of axes) {
    weightedSum += axisScores[axis] * AXIS_WEIGHTS[axis];
  }

  // Complementary bonus: opposite traits that balance each other
  let complementaryBonus = 0;
  for (const { axis, bonus } of COMPLEMENTARY_PAIRS) {
    const distance = Math.abs(myAxes[axis] - theirAxes[axis]);
    if (distance > 50) {
      // Big difference = potential complementary balance
      complementaryBonus += bonus * (distance - 50) / 50;
    }
  }

  const overallScore = Math.round(
    Math.max(0, Math.min(100, weightedSum + complementaryBonus))
  );

  // Determine common ground and differences
  const SIMILARITY_THRESHOLD = 70;
  const DIFFERENCE_THRESHOLD = 40;

  const commonGround: string[] = [];
  const differences: string[] = [];

  for (const axis of axes) {
    if (axisScores[axis] >= SIMILARITY_THRESHOLD) {
      commonGround.push(AXIS_NAMES[axis]);
    } else if (axisScores[axis] <= DIFFERENCE_THRESHOLD) {
      differences.push(AXIS_NAMES[axis]);
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
