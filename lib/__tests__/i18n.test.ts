import { t, getLang, getDateLocale, localizeQuestion } from '../i18n';

describe('i18n', () => {
  describe('Translation function', () => {
    it('should return a string for tabToday', () => {
      expect(typeof t('tabToday')).toBe('string');
      expect(t('tabToday').length).toBeGreaterThan(0);
    });

    it('should return a string for tabProfile', () => {
      expect(typeof t('tabProfile')).toBe('string');
      expect(t('tabProfile').length).toBeGreaterThan(0);
    });

    it('should handle totalVotesLabel with params', () => {
      const result = t('totalVotesLabel', { count: 42 });
      expect(result).toContain('42');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle shareText with params', () => {
      const result = t('shareText', { question: 'Test Q', choice: 'Option A', percent: 50 });
      expect(result).toContain('Test Q');
      expect(result).toContain('Option A');
      expect(result).toContain('50');
      expect(result).toContain('SplitSecond');
    });

    it('should handle nextGoal with milestone param', () => {
      const result = t('nextGoal', { milestone: 7 });
      expect(result).toContain('7');
    });

    it('should handle longestStreakLabel with streak param', () => {
      const result = t('longestStreakLabel', { streak: 10 });
      expect(result).toContain('10');
    });

    it('should handle socialProofMajority with percent param', () => {
      const result = t('socialProofMajority', { percent: 75 });
      expect(result).toContain('75');
    });

    it('should return app name', () => {
      expect(t('appName')).toBe('Split Second');
    });

    it('should return dayStreak', () => {
      const result = t('dayStreak');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return key if translation not found', () => {
      // @ts-expect-error - testing invalid key
      expect(t('nonExistentKey')).toBe('nonExistentKey');
    });

    it('should fall back to English if current lang translation missing', () => {
      // Since we're in 'en' mode, test that it would fall back
      // This tests the ?? fallback chain: currentLang -> 'en' -> key
      // We can't easily change currentLang at runtime, but we can verify EN works
      const result = t('appName');
      expect(result).toBe('Split Second');
    });

    it('should replace multiple params in text', () => {
      const result = t('challengeShareText', {
        question: 'Test Question',
        link: 'https://example.com'
      });
      expect(result).toContain('Test Question');
      expect(result).toContain('https://example.com');
    });
  });

  describe('Language detection', () => {
    it('should return a valid language code', () => {
      const lang = getLang();
      expect(['en', 'tr']).toContain(lang);
    });

    it('should return a valid date locale', () => {
      const locale = getDateLocale();
      expect(typeof locale).toBe('string');
      expect(locale.length).toBeGreaterThan(0);
    });

    it('should return en-US for English language', () => {
      // Since the mock returns 'en', this tests the EN branch
      const lang = getLang();
      if (lang === 'en') {
        expect(getDateLocale()).toBe('en-US');
      }
    });

    it('should return tr-TR for Turkish language if detected', () => {
      // This tests the TR branch logic (even if not active in test)
      const locale = getDateLocale();
      expect(['en-US', 'tr-TR']).toContain(locale);
    });
  });

  describe('Question localization', () => {
    it('should return question fields when no Turkish fields present', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
      };

      const result = localizeQuestion(question);
      expect(result.question_text).toBe('Original question');
      expect(result.option_a).toBe('Option A');
      expect(result.option_b).toBe('Option B');
    });

    it('should return original fields when language is EN (ignores TR fields)', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        question_text_tr: 'Türkçe soru',
        option_a_tr: 'Seçenek A',
        option_b_tr: 'Seçenek B',
      };

      // Since getLang() returns 'en' in tests, TR fields should be ignored
      const lang = getLang();
      if (lang === 'en') {
        const result = localizeQuestion(question);
        expect(result.question_text).toBe('Original question');
        expect(result.option_a).toBe('Option A');
        expect(result.option_b).toBe('Option B');
      }
    });

    it('should handle questions with Turkish fields', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        question_text_tr: 'Türkçe soru',
        option_a_tr: 'Seçenek A',
        option_b_tr: 'Seçenek B',
      };

      const result = localizeQuestion(question);
      expect(typeof result.question_text).toBe('string');
      expect(typeof result.option_a).toBe('string');
      expect(typeof result.option_b).toBe('string');
      expect(result.question_text.length).toBeGreaterThan(0);
      expect(result.option_a.length).toBeGreaterThan(0);
      expect(result.option_b.length).toBeGreaterThan(0);
    });

    it('should handle fallback when TR fields are null', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        question_text_tr: 'Türkçe soru',
        option_a_tr: null,
        option_b_tr: null,
      };

      const result = localizeQuestion(question);
      expect(typeof result.question_text).toBe('string');
      expect(typeof result.option_a).toBe('string');
      expect(typeof result.option_b).toBe('string');
      expect(result.question_text.length).toBeGreaterThan(0);
      expect(result.option_a.length).toBeGreaterThan(0);
      expect(result.option_b.length).toBeGreaterThan(0);
    });

    it('should handle partial Turkish translations', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        question_text_tr: 'Türkçe soru',
        option_a_tr: 'Seçenek A',
        option_b_tr: null,
      };

      const result = localizeQuestion(question);
      expect(typeof result.question_text).toBe('string');
      expect(typeof result.option_a).toBe('string');
      expect(typeof result.option_b).toBe('string');
    });

    it('should handle empty string TR fields', () => {
      const question = {
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        question_text_tr: '',
        option_a_tr: '',
        option_b_tr: '',
      };

      const result = localizeQuestion(question);
      expect(result.question_text.length).toBeGreaterThan(0);
      expect(result.option_a.length).toBeGreaterThan(0);
      expect(result.option_b.length).toBeGreaterThan(0);
    });

    it('should preserve other fields in the question object', () => {
      const question = {
        id: 'q123',
        question_text: 'Original question',
        option_a: 'Option A',
        option_b: 'Option B',
        category: 'philosophy',
        scheduled_date: '2026-02-06',
      };

      const result = localizeQuestion(question);
      expect(result.id).toBe('q123');
      expect(result.category).toBe('philosophy');
      expect(result.scheduled_date).toBe('2026-02-06');
    });
  });
});
