import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useDailyCountdown } from '../hooks/useDailyCountdown';
import { t } from '../lib/i18n';

export function DailyCountdown() {
  const { formatted } = useDailyCountdown();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('nextQuestionIn')}</Text>
      <Text style={styles.time}>{formatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
});
