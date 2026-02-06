import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { useDailyCountdown } from '../hooks/useDailyCountdown';
import { t } from '../lib/i18n';

export function DailyCountdown() {
  const colors = useTheme();
  const { formatted } = useDailyCountdown();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{t('nextQuestionIn')}</Text>
      <Text style={[styles.time, { color: colors.text }]}>{formatted}</Text>
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
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
