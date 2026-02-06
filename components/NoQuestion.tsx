import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { DailyCountdown } from './DailyCountdown';
import { t } from '../lib/i18n';

export function NoQuestion() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏳</Text>
      <Text style={styles.title}>{t('noQuestionToday')}</Text>
      <Text style={styles.subtitle}>{t('comeBackTomorrow')}</Text>
      <DailyCountdown />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
