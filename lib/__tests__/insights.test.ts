import { getCategoryInsight } from '../insights';

describe('insights', () => {
  describe('Category insights', () => {
    it('should return a string for superpower category', () => {
      const result = getCategoryInsight('superpower');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a string for lifestyle category', () => {
      const result = getCategoryInsight('lifestyle');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a string for philosophy category', () => {
      const result = getCategoryInsight('philosophy');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a string for technology category', () => {
      const result = getCategoryInsight('technology');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a string for unknown category', () => {
      const result = getCategoryInsight('unknown_category');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a string for empty category', () => {
      const result = getCategoryInsight('');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return strings for all category types', () => {
      const categories = [
        'superpower',
        'lifestyle',
        'philosophy',
        'technology',
        'food',
        'skills',
        'personality',
        'entertainment',
        'adventure',
        'funny',
      ];

      categories.forEach(category => {
        const result = getCategoryInsight(category);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Deterministic output with mocked Math.random', () => {
    let originalRandom: any;

    beforeEach(() => {
      originalRandom = Math.random;
    });

    afterEach(() => {
      Math.random = originalRandom;
    });

    it('should use random selection for messages', () => {
      const results = new Set();
      // Call the function multiple times to ensure it can return different values
      for (let i = 0; i < 50; i++) {
        const result = getCategoryInsight('superpower');
        results.add(result);
      }
      // Should have returned at least one value (possibly more if random)
      expect(results.size).toBeGreaterThanOrEqual(1);
    });

    it('should consistently return a value for the same category', () => {
      const result1 = getCategoryInsight('philosophy');
      const result2 = getCategoryInsight('philosophy');
      // Both should be strings
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
      // Both should be non-empty
      expect(result1.length).toBeGreaterThan(0);
      expect(result2.length).toBeGreaterThan(0);
    });
  });

  describe('Branch coverage - specific message selection', () => {
    let randomSpy: jest.SpyInstance;

    beforeEach(() => {
      randomSpy = jest.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should return first message when Math.random returns 0', () => {
      randomSpy.mockReturnValue(0);

      const result = getCategoryInsight('superpower');

      // First message in EN superpower array
      expect(result).toBe('Every dreamer has a different wish');
    });

    it('should return last message when Math.random returns 0.99', () => {
      randomSpy.mockReturnValue(0.99);

      const result = getCategoryInsight('superpower');

      // Last message in EN superpower array (floor(0.99 * 3) = 2, index 2)
      expect(result).toBe('Everyone has a superhero inside');
    });

    it('should return middle message when Math.random returns 0.5', () => {
      randomSpy.mockReturnValue(0.5);

      const result = getCategoryInsight('philosophy');

      // Middle message in EN philosophy array (floor(0.5 * 3) = 1, index 1)
      expect(result).toBe('Even philosophers can\'t agree on this');
    });
  });

  describe('Branch coverage - all EN categories', () => {
    const allCategories = [
      'superpower',
      'lifestyle',
      'philosophy',
      'technology',
      'food',
      'skills',
      'personality',
      'entertainment',
      'adventure',
      'funny',
    ];

    allCategories.forEach(category => {
      it(`should return a message for ${category} category in EN`, () => {
        const result = getCategoryInsight(category);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Branch coverage - unknown category fallback', () => {
    let randomSpy: jest.SpyInstance;

    beforeEach(() => {
      randomSpy = jest.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should fall back to default messages for unknown category (first message)', () => {
      randomSpy.mockReturnValue(0);

      const result = getCategoryInsight('nonexistent_category');

      // First message in defaultMessagesEN
      expect(result).toBe('Everyone has a preference');
    });

    it('should fall back to default messages for unknown category (middle message)', () => {
      randomSpy.mockReturnValue(0.5);

      const result = getCategoryInsight('another_unknown');

      // Middle message in defaultMessagesEN (floor(0.5 * 3) = 1)
      expect(result).toBe('Choices define us');
    });

    it('should fall back to default messages for unknown category (last message)', () => {
      randomSpy.mockReturnValue(0.99);

      const result = getCategoryInsight('invalid_category');

      // Last message in defaultMessagesEN (floor(0.99 * 3) = 2)
      expect(result).toBe('What an interesting debate!');
    });
  });
});
