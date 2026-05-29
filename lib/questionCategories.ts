import { TranslationKey } from './i18n';

export const CANONICAL_CATEGORIES = [
  'lifestyle',
  'philosophy',
  'superpower',
  'technology',
  'skills',
  'food',
  'adventure',
  'entertainment',
  'personality',
  'funny',
  'dating',
] as const;

export type CanonicalCategory = (typeof CANONICAL_CATEGORIES)[number];

export const CATEGORY_ALIASES: Record<string, CanonicalCategory> = {
  superpowers: 'superpower',
  tech: 'technology',
  skill: 'skills',
  general: 'lifestyle',
};

/** Map non-canonical categories to canonical by question theme */
export const CATEGORY_REMAP: Record<string, CanonicalCategory> = {
  nostalgia: 'entertainment',
  survival: 'adventure',
};

export const CATEGORY_LABEL_KEYS: Record<CanonicalCategory, TranslationKey> = {
  lifestyle: 'catLifestyle',
  philosophy: 'catPhilosophy',
  superpower: 'catSuperpower',
  technology: 'catTechnology',
  skills: 'catSkills',
  food: 'catFood',
  adventure: 'catAdventure',
  entertainment: 'catEntertainment',
  personality: 'catPersonality',
  funny: 'catFunny',
  dating: 'catDating',
};

export function normalizeCategory(raw: string | null | undefined): CanonicalCategory {
  const key = (raw ?? '').trim().toLowerCase();
  if (!key) return 'lifestyle';
  if ((CANONICAL_CATEGORIES as readonly string[]).includes(key)) {
    return key as CanonicalCategory;
  }
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  if (CATEGORY_REMAP[key]) return CATEGORY_REMAP[key];
  return 'lifestyle';
}

export function isCanonicalCategory(cat: string): cat is CanonicalCategory {
  return (CANONICAL_CATEGORIES as readonly string[]).includes(cat);
}
