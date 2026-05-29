import {
  calculateAxes,
  determineType,
  shouldRecalculatePersonality,
  isFirstPersonalityUnlock,
  parsePersonalityContext,
  DIVERSITY_CATEGORY_COUNT,
  PERSONALITY_UNLOCK_VOTES,
  type PersonalityContextV2,
} from '../personality';
import { CANONICAL_CATEGORIES } from '../questionCategories';

function baseContext(overrides: Partial<PersonalityContextV2> = {}): PersonalityContextV2 {
  return {
    total_votes: 10,
    votes_analyzed: 10,
    model_version: 2,
    current_type: 'flash_rebel',
    personality_type: 'flash_rebel',
    behavioral_axes: {
      conformity: 80,
      speed: 60,
      diversity: 50,
      courage: 40,
    },
    behavioral_ready: true,
    content_axes: {},
    content_ready: false,
    content_unlocked: false,
    dating_profile: null,
    dating_unlocked: false,
    dating_votes_count: 0,
    v2_available: true,
    ...overrides,
  };
}

describe('personality', () => {
  describe('parsePersonalityContext', () => {
    it('derives behavioral axes from v1 majority_count when v2 fields missing', () => {
      const ctx = parsePersonalityContext(
        {
          total_votes: 10,
          majority_count: 8,
          avg_vote_time: 5,
          unique_categories: 5,
          minority_in_skewed: 0,
          skewed_questions: 0,
          current_type: 'flash_rebel',
          votes_analyzed: 10,
        },
        { v2Available: false },
      );
      expect(ctx?.behavioral_ready).toBe(true);
      expect(ctx?.behavioral_axes?.conformity).toBe(80);
      expect(ctx?.content_ready).toBe(false);
    });

    it('does not mark behavioral ready when v1 metrics absent and axes all zero', () => {
      const ctx = parsePersonalityContext(
        {
          total_votes: 10,
          behavioral_axes: { conformity: 0, speed: 0, diversity: 0, courage: 0 },
          model_version: 1,
          votes_analyzed: 0,
          current_type: 'unknown',
        },
        { v2Available: false },
      );
      expect(ctx?.behavioral_ready).toBe(false);
      expect(ctx?.behavioral_axes).toBeNull();
    });
  });

  describe('calculateAxes (legacy behavioral helper)', () => {
    it('computes conformity from majority ratio', () => {
      const axes = calculateAxes({
        majority_count: 8,
        total_votes: 10,
        avg_vote_time: 5,
        unique_categories: 5,
        minority_in_skewed: 0,
        skewed_questions: 0,
      });
      expect(axes.conformity).toBe(80);
    });

    it('uses canonical category count for diversity', () => {
      expect(DIVERSITY_CATEGORY_COUNT).toBe(CANONICAL_CATEGORIES.length);
    });
  });

  describe('determineType', () => {
    it('returns a known type', () => {
      const type = determineType({ conformity: 10, speed: 95, diversity: 50, courage: 80 });
      expect(type.id).toBeTruthy();
    });
  });

  describe('shouldRecalculatePersonality', () => {
    it('returns false below unlock threshold', () => {
      expect(shouldRecalculatePersonality(baseContext({ total_votes: PERSONALITY_UNLOCK_VOTES - 1 }))).toBe(false);
    });

    it('returns false when v2 not available (old DB)', () => {
      expect(shouldRecalculatePersonality(baseContext({ v2_available: false, model_version: 1 }))).toBe(false);
    });

    it('returns true when v1 model needs upgrade', () => {
      expect(shouldRecalculatePersonality(baseContext({ model_version: 1 }))).toBe(true);
    });

    it('returns true when new votes exist since last save', () => {
      expect(shouldRecalculatePersonality(baseContext({ total_votes: 12, votes_analyzed: 10 }))).toBe(true);
    });

    it('returns false when saved profile matches current vote count', () => {
      expect(shouldRecalculatePersonality(baseContext({ total_votes: 10, votes_analyzed: 10, model_version: 2 }))).toBe(false);
    });
  });

  describe('isFirstPersonalityUnlock', () => {
    it('is true only before a saved profile exists', () => {
      expect(isFirstPersonalityUnlock(baseContext({ current_type: 'unknown', votes_analyzed: 0 }))).toBe(true);
      expect(isFirstPersonalityUnlock(baseContext({ current_type: 'flash_rebel', votes_analyzed: 6, model_version: 2 }))).toBe(false);
    });
  });
});
