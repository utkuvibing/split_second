import {
  computeBehavioralAxes,
  determinePersonalityTypeV2,
  aggregateVoteSignals,
  normalizeContentAxes,
  buildDatingProfile,
  shouldRefreshPersonalityV2,
  isFirstPersonalityUnlockV2,
  computePersonalityProfileV2,
} from '../personality-scoring';
import { DIVERSITY_CATEGORY_COUNT } from '../personality-constants';
import type { VoteSignalRow } from '../personality-scoring';

describe('personality-scoring v2', () => {
  const behavioralCtx = {
    total_votes: 10,
    majority_count: 7,
    avg_vote_time: 3,
    unique_categories: 5,
    minority_in_skewed: 2,
    skewed_questions: 4,
  };

  const sampleSignalRow: VoteSignalRow = {
    choice: 'a',
    category: 'dating',
    personality_signals: {
      category: 'dating',
      a: { independence: -1, commitment_readiness: 2, social_energy: 1 },
      b: { independence: 2, practicality: 1 },
      dating: {
        a: { attachment_style: 'anxious_lean', communication_style: 'frequent', dating_pace: 2 },
        b: { attachment_style: 'avoidant_lean', communication_style: 'minimal', dating_pace: -1 },
      },
    },
  };

  describe('computeBehavioralAxes', () => {
    it('matches diversity denominator of 11', () => {
      const axes = computeBehavioralAxes({ ...behavioralCtx, unique_categories: 11 });
      expect(axes.diversity).toBe(100);
    });
  });

  describe('aggregateVoteSignals', () => {
    it('accumulates content raw and dating votes', () => {
      const agg = aggregateVoteSignals([sampleSignalRow]);
      expect(agg.content_raw.independence).toBe(-1);
      expect(agg.dating_votes_count).toBe(1);
    });
  });

  describe('normalizeContentAxes', () => {
    it('shrinks toward neutral with low coverage', () => {
      const agg = aggregateVoteSignals([sampleSignalRow]);
      const { axes, confidence } = normalizeContentAxes(agg);
      expect(axes.independence).toBeGreaterThanOrEqual(40);
      expect(axes.independence).toBeLessThanOrEqual(60);
      expect(confidence.independence).toBeLessThan(1);
    });
  });

  describe('buildDatingProfile', () => {
    it('returns null without dating votes', () => {
      expect(buildDatingProfile(aggregateVoteSignals([]))).toBeNull();
    });

    it('unlocks after 5 dating votes', () => {
      const rows = Array.from({ length: 5 }, () => sampleSignalRow);
      const profile = buildDatingProfile(aggregateVoteSignals(rows));
      expect(profile?.unlocked).toBe(true);
      expect(profile?.votes_count).toBe(5);
    });
  });

  describe('determinePersonalityTypeV2', () => {
    it('is deterministic', () => {
      const behavioral = computeBehavioralAxes(behavioralCtx);
      const content = Object.fromEntries(
        ['risk_tolerance', 'novelty_seeking', 'social_energy', 'independence', 'emotionality',
          'practicality', 'commitment_readiness', 'communication_directness', 'conflict_style',
          'romance_style', 'chaos_tolerance'].map((k) => [k, 80]),
      ) as Record<string, number>;
      const a = determinePersonalityTypeV2(behavioral, content as never);
      const b = determinePersonalityTypeV2(behavioral, content as never);
      expect(a).toBe(b);
    });
  });

  describe('shouldRefreshPersonalityV2', () => {
    it('refreshes stale v1 profiles', () => {
      expect(shouldRefreshPersonalityV2(10, 10, 'flash_rebel', 1)).toBe(true);
    });

    it('skips fresh v2 profiles', () => {
      expect(shouldRefreshPersonalityV2(10, 10, 'flash_rebel', 2)).toBe(false);
    });
  });

  describe('computePersonalityProfileV2', () => {
    it('produces model version 2 profile', () => {
      const profile = computePersonalityProfileV2(behavioralCtx, [sampleSignalRow]);
      expect(profile.model_version).toBe(2);
      expect(profile.personality_type).not.toBe('unknown');
      expect(DIVERSITY_CATEGORY_COUNT).toBe(11);
    });
  });

  describe('isFirstPersonalityUnlockV2', () => {
    it('detects first unlock', () => {
      expect(isFirstPersonalityUnlockV2('unknown', 0, 1)).toBe(true);
      expect(isFirstPersonalityUnlockV2('flash_rebel', 6, 2)).toBe(false);
    });
  });
});
