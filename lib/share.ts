import { Share, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { t } from './i18n';

interface ShareTextParams {
  questionText: string;
  userChoice: string;
  userPercent: number;
}

export async function shareResult({ questionText, userChoice, userPercent }: ShareTextParams) {
  const message = t('shareText', {
    question: questionText,
    choice: userChoice,
    percent: userPercent,
  });

  try {
    await Share.share({ message });
  } catch {
    // User cancelled or share failed - silently ignore
  }
}

export async function shareImage(viewRef: React.RefObject<View | null>) {
  try {
    if (!viewRef.current) {
      console.error('Share image error: ref is null');
      return;
    }

    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      await Share.share({ message: t('shareFallback') });
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: t('shareDialogTitle'),
    });
  } catch (error) {
    console.error('Share image error:', error);
  }
}
