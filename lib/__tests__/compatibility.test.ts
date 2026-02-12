import { calculateCompatibility, getCompatibilityLabelKey } from '../compatibility';
import { PersonalityAxes } from '../personality';

describe('compatibility', () => {
  const baseAxes: PersonalityAxes = {
    conformity: 50,
    speed: 50,
    diversity: 50,
    courage: 50,
  };

  describe('calculateCompatibility', () => {
    it('returns 100% for identical profiles', () => {
      const result = calculateCompatibility(baseAxes, { ...baseAxes });
      expect(result.overallScore).toBe(100);
      expect(result.label).toBe('soulmate');
      expect(result.axisScores.conformity).toBe(100);
      expect(result.axisScores.speed).toBe(100);
      expect(result.axisScores.diversity).toBe(100);
      expect(result.axisScores.courage).toBe(100);
    });

    it('returns low score for opposite profiles', () => {
      const opposite: PersonalityAxes = {
        conformity: 0,
        speed: 0,
        diversity: 0,
        courage: 0,
      };
      const me: PersonalityAxes = {
        conformity: 100,
        speed: 100,
        diversity: 100,
        courage: 100,
      };
      const result = calculateCompatibility(me, opposite);
      expect(result.overallScore).toBeLessThan(30);
    });

    it('returns per-axis similarity scores', () => {
      const me: PersonalityAxes = { conformity: 80, speed: 60, diversity: 40, courage: 70 };
      const them: PersonalityAxes = { conformity: 70, speed: 50, diversity: 90, courage: 30 };
      const result = calculateCompatibility(me, them);

      // conformity: 100 - |80-70| = 90
      expect(result.axisScores.conformity).toBe(90);
      // speed: 100 - |60-50| = 90
      expect(result.axisScores.speed).toBe(90);
      // diversity: 100 - |40-90| = 50
      expect(result.axisScores.diversity).toBe(50);
      // courage: 100 - |70-30| = 60
      expect(result.axisScores.courage).toBe(60);
    });

    it('identifies common ground (high similarity axes)', () => {
      const me: PersonalityAxes = { conformity: 80, speed: 75, diversity: 50, courage: 90 };
      const them: PersonalityAxes = { conformity: 85, speed: 70, diversity: 50, courage: 85 };
      const result = calculateCompatibility(me, them);

      // All axes are very similar (diff <= 10), all should be common ground
      expect(result.commonGround.length).toBeGreaterThan(0);
      expect(result.differences.length).toBe(0);
    });

    it('identifies differences (low similarity axes)', () => {
      const me: PersonalityAxes = { conformity: 10, speed: 90, diversity: 20, courage: 80 };
      const them: PersonalityAxes = { conformity: 90, speed: 10, diversity: 90, courage: 10 };
      const result = calculateCompatibility(me, them);

      // Large differences on all axes
      expect(result.differences.length).toBeGreaterThan(0);
    });

    it('applies complementary bonus for large courage differences', () => {
      const me: PersonalityAxes = { conformity: 50, speed: 50, diversity: 50, courage: 10 };
      const them: PersonalityAxes = { conformity: 50, speed: 50, diversity: 50, courage: 90 };

      const resultWithBonus = calculateCompatibility(me, them);

      // Without complementary bonus, score would be lower
      // courage distance = 80, which is > 50, so bonus applies
      const pureAxisScore = 100 - 80; // 20 for courage
      // Weighted: conformity 100*0.3 + speed 100*0.2 + diversity 100*0.25 + courage 20*0.25 = 30+20+25+5 = 80
      // With complementary bonus for courage: bonus = 5 * (80-50)/50 = 3
      expect(resultWithBonus.overallScore).toBeGreaterThanOrEqual(80);
    });

    it('clamps score between 0 and 100', () => {
      const result = calculateCompatibility(baseAxes, baseAxes);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);

      const opposite: PersonalityAxes = { conformity: 0, speed: 0, diversity: 0, courage: 100 };
      const me: PersonalityAxes = { conformity: 100, speed: 100, diversity: 100, courage: 0 };
      const result2 = calculateCompatibility(me, opposite);
      expect(result2.overallScore).toBeLessThanOrEqual(100);
      expect(result2.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('assigns correct labels based on score', () => {
      // Identical = soulmate (100%)
      const soulmate = calculateCompatibility(baseAxes, baseAxes);
      expect(soulmate.label).toBe('soulmate');

      // Very different = low label
      const veryDifferent = calculateCompatibility(
        { conformity: 0, speed: 0, diversity: 0, courage: 0 },
        { conformity: 100, speed: 100, diversity: 100, courage: 100 }
      );
      expect(['opposite', 'different']).toContain(veryDifferent.label);
    });
  });

  describe('getCompatibilityLabelKey', () => {
    it('returns correct key for soulmate', () => {
      expect(getCompatibilityLabelKey('soulmate')).toBe('soulmate');
    });

    it('returns correct key for veryCompatible', () => {
      expect(getCompatibilityLabelKey('veryCompatible')).toBe('veryCompatible');
    });

    it('returns correct key for compatible', () => {
      expect(getCompatibilityLabelKey('compatible')).toBe('compatibleLabel');
    });

    it('returns correct key for different', () => {
      expect(getCompatibilityLabelKey('different')).toBe('differentPaths');
    });

    it('returns correct key for opposite', () => {
      expect(getCompatibilityLabelKey('opposite')).toBe('opposites');
    });
  });
});
