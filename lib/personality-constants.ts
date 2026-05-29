/** Shared personality v2 constants (client + tests). */

export const PERSONALITY_MODEL_VERSION = 2;

export const CONTENT_AXES = [
  'risk_tolerance',
  'novelty_seeking',
  'social_energy',
  'independence',
  'emotionality',
  'practicality',
  'commitment_readiness',
  'communication_directness',
  'conflict_style',
  'romance_style',
  'chaos_tolerance',
] as const;

export type ContentAxis = (typeof CONTENT_AXES)[number];

export const BEHAVIORAL_AXES = [
  'conformity',
  'speed',
  'diversity',
  'courage',
] as const;

export type BehavioralAxis = (typeof BEHAVIORAL_AXES)[number];

export const ALL_PERSONALITY_AXES = [...BEHAVIORAL_AXES, ...CONTENT_AXES] as const;

export type PersonalityAxisKey = (typeof ALL_PERSONALITY_AXES)[number];

export const DATING_DIMENSIONS = [
  'attachment_style',
  'dating_pace',
  'communication_style',
  'conflict_style',
  'romance_style',
  'privacy_style',
  'togetherness',
] as const;

export type DatingDimension = (typeof DATING_DIMENSIONS)[number];

export const DATING_ATTACHMENT_VALUES = [
  'secure_lean',
  'anxious_lean',
  'avoidant_lean',
  'mixed',
] as const;

export const DATING_COMMUNICATION_VALUES = ['frequent', 'balanced', 'minimal'] as const;
export const DATING_CONFLICT_VALUES = ['harmonizer', 'direct', 'competitive'] as const;
export const DATING_ROMANCE_VALUES = ['grand', 'steady', 'low_key'] as const;
export const DATING_PRIVACY_VALUES = ['public', 'balanced', 'private'] as const;

export const SIGNAL_VALUES = [-2, -1, 1, 2] as const;
export type SignalValue = (typeof SIGNAL_VALUES)[number];

export const CONTENT_AXIS_COVERAGE_TARGET = 4;
export const DATING_AXIS_COVERAGE_TARGET = 3;

export const PERSONALITY_UNLOCK_VOTES = 6;
export const CONTENT_AXES_UNLOCK_VOTES = 8;
export const DATING_PROFILE_UNLOCK_VOTES = 5;
export const DATING_CONFIDENCE_FULL_VOTES = 8;

export const DIVERSITY_CATEGORY_COUNT = 11;
