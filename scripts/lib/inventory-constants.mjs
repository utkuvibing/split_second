export const START_DATE = '2026-05-29';
export const EXPECTED_COUNT = 214;
export const SLOTS = ['morning', 'afternoon', 'evening'];
export const DATING_MIN = 20;
export const DATING_MAX = 30;

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
];

export const CATEGORY_ALIASES = {
  superpowers: 'superpower',
  tech: 'technology',
  skill: 'skills',
  general: 'lifestyle',
};

export const CATEGORY_REMAP = {
  nostalgia: 'entertainment',
  survival: 'adventure',
};

export function normalizeCategory(raw) {
  const key = (raw ?? '').trim().toLowerCase();
  if (!key) return 'lifestyle';
  if (CANONICAL_CATEGORIES.includes(key)) return key;
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  if (CATEGORY_REMAP[key]) return CATEGORY_REMAP[key];
  return 'lifestyle';
}

export function addDays(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function assignSchedule(index) {
  const dayOffset = Math.floor(index / 3);
  const slot = SLOTS[index % 3];
  return {
    scheduled_date: addDays(START_DATE, dayOffset),
    time_slot: slot,
  };
}
