import { Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { shareResult, shareImage } from '../share';

jest.mock('../../lib/i18n', () => ({
  t: jest.fn((key: string, params?: Record<string, string | number>) => {
    if (key === 'shareText' && params) {
      return `${params.question}\n\nI chose "${params.choice}" (${params.percent}% agreed!)\n\n#SplitSecond`;
    }
    if (key === 'shareFallback') return 'See my results! #SplitSecond';
    if (key === 'shareDialogTitle') return 'Share your result!';
    return key;
  }),
}));

describe('share', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('shareResult', () => {
    it('should call Share.share with formatted message', async () => {
      await shareResult({
        questionText: 'Fly or invisible?',
        userChoice: 'Fly',
        userPercent: 60,
      });

      expect(Share.share).toHaveBeenCalledWith({
        message: 'Fly or invisible?\n\nI chose "Fly" (60% agreed!)\n\n#SplitSecond',
      });
    });

    it('should handle user cancellation silently', async () => {
      jest.spyOn(Share, 'share').mockRejectedValue(new Error('User cancelled'));

      await expect(
        shareResult({
          questionText: 'Test?',
          userChoice: 'A',
          userPercent: 50,
        })
      ).resolves.toBeUndefined();
    });
  });

  describe('shareImage', () => {
    it('should log error and return when ref is null', async () => {
      const viewRef = { current: null };

      await shareImage(viewRef as never);

      expect(console.error).toHaveBeenCalledWith('Share image error: ref is null');
      expect(captureRef).not.toHaveBeenCalled();
    });

    it('should use Sharing.shareAsync when sharing is available', async () => {
      const viewRef = { current: {} };
      (captureRef as jest.Mock).mockResolvedValue('/mock/screenshot.png');
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);

      await shareImage(viewRef as never);

      expect(captureRef).toHaveBeenCalledWith(viewRef, {
        format: 'png',
        quality: 1,
      });
      expect(Sharing.shareAsync).toHaveBeenCalledWith('/mock/screenshot.png', {
        mimeType: 'image/png',
        dialogTitle: 'Share your result!',
      });
    });

    it('should fall back to Share.share when sharing is not available', async () => {
      const viewRef = { current: {} };
      (captureRef as jest.Mock).mockResolvedValue('/mock/screenshot.png');
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      await shareImage(viewRef as never);

      expect(Share.share).toHaveBeenCalledWith({
        message: 'See my results! #SplitSecond',
      });
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('should log error when captureRef fails', async () => {
      const viewRef = { current: {} };
      (captureRef as jest.Mock).mockRejectedValue(new Error('Capture failed'));

      await shareImage(viewRef as never);

      expect(console.error).toHaveBeenCalledWith('Share image error:', expect.any(Error));
    });
  });
});
