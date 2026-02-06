import { Share } from 'react-native';
import { t } from './i18n';

export function buildChallengeLink(date: string): string {
  return `split-second://q/${date}`;
}

export async function shareChallenge(questionText: string, date: string) {
  const link = buildChallengeLink(date);
  const message = t('challengeShareText', {
    question: questionText,
    link,
  });

  try {
    await Share.share({ message });
  } catch {
    // User cancelled - silently ignore
  }
}
