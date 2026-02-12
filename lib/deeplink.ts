import { Share } from 'react-native';
import { t } from './i18n';

export function buildChallengeLink(date: string, slot?: string): string {
  const base = `split-second://q/${date}`;
  return slot ? `${base}?slot=${slot}` : base;
}

export async function shareChallenge(questionText: string, date: string, slot?: string) {
  const link = buildChallengeLink(date, slot);
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
