import { Share } from 'react-native';
import { buildChallengeLink, shareChallenge } from '../deeplink';

jest.mock('../../lib/i18n', () => ({
  t: jest.fn((key: string, params?: Record<string, string | number>) => {
    if (key === 'challengeShareText' && params) {
      return `I challenge you! 🎯\n\n"${params.question}"\n\nWhat would you choose? 👉 ${params.link}\n\n#SplitSecond`;
    }
    return key;
  }),
}));

describe('deeplink', () => {
  describe('buildChallengeLink', () => {
    it('should build correct challenge link for valid date', () => {
      expect(buildChallengeLink('2025-01-15')).toBe('split-second://q/2025-01-15');
    });

    it('should build link with empty date', () => {
      expect(buildChallengeLink('')).toBe('split-second://q/');
    });

    it('should build link for different date formats', () => {
      expect(buildChallengeLink('2024-12-31')).toBe('split-second://q/2024-12-31');
      expect(buildChallengeLink('2026-02-06')).toBe('split-second://q/2026-02-06');
      expect(buildChallengeLink('2025-01-01')).toBe('split-second://q/2025-01-01');
    });

    it('should build link for various date strings', () => {
      expect(buildChallengeLink('2025-06-15')).toBe('split-second://q/2025-06-15');
      expect(buildChallengeLink('2025-11-30')).toBe('split-second://q/2025-11-30');
    });

    it('should handle non-standard date formats', () => {
      expect(buildChallengeLink('01-15-2025')).toBe('split-second://q/01-15-2025');
      expect(buildChallengeLink('15/01/2025')).toBe('split-second://q/15/01/2025');
      expect(buildChallengeLink('20250115')).toBe('split-second://q/20250115');
    });

    it('should handle arbitrary strings as date parameter', () => {
      expect(buildChallengeLink('today')).toBe('split-second://q/today');
      expect(buildChallengeLink('test-date')).toBe('split-second://q/test-date');
    });

    it('should always use split-second:// protocol', () => {
      const link = buildChallengeLink('2025-01-15');
      expect(link.startsWith('split-second://')).toBe(true);
    });

    it('should always include /q/ path', () => {
      const link = buildChallengeLink('2025-01-15');
      expect(link).toContain('/q/');
    });
  });

  describe('shareChallenge', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call Share.share with formatted challenge message', async () => {
      await shareChallenge('Fly or invisible?', '2025-01-15');

      expect(Share.share).toHaveBeenCalledWith({
        message: 'I challenge you! 🎯\n\n"Fly or invisible?"\n\nWhat would you choose? 👉 split-second://q/2025-01-15\n\n#SplitSecond',
      });
    });

    it('should handle user cancellation silently', async () => {
      jest.spyOn(Share, 'share').mockRejectedValue(new Error('User cancelled'));

      await expect(shareChallenge('Test?', '2025-01-15')).resolves.toBeUndefined();
    });

    it('should include the correct deep link in the message', async () => {
      await shareChallenge('Pizza or sushi?', '2025-06-20');

      const call = (Share.share as jest.Mock).mock.calls[0][0];
      expect(call.message).toContain('split-second://q/2025-06-20');
    });
  });
});
