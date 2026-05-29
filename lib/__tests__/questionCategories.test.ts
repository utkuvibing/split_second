import {
  CANONICAL_CATEGORIES,
  normalizeCategory,
  isCanonicalCategory,
} from '../questionCategories';

describe('questionCategories', () => {
  it('includes dating in canonical list', () => {
    expect(CANONICAL_CATEGORIES).toContain('dating');
    expect(CANONICAL_CATEGORIES).toHaveLength(11);
  });

  it('normalizes aliases', () => {
    expect(normalizeCategory('superpowers')).toBe('superpower');
    expect(normalizeCategory('tech')).toBe('technology');
    expect(normalizeCategory('skill')).toBe('skills');
    expect(normalizeCategory('nostalgia')).toBe('entertainment');
    expect(normalizeCategory('survival')).toBe('adventure');
  });

  it('passes through canonical categories', () => {
    expect(normalizeCategory('dating')).toBe('dating');
    expect(isCanonicalCategory('dating')).toBe(true);
  });
});
