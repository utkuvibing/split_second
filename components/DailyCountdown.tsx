import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { useDailyCountdown } from '../hooks/useDailyCountdown';
import { t } from '../lib/i18n';
import { GLASS, RADIUS } from '../constants/ui';

export function DailyCountdown() {
  const colors = useTheme();
  const { formatted, label } = useDailyCountdown();

  const labelText = label === 'next_question'
    ? t('nextQuestionIn')
    : t('nextQuestionsIn');

  return (
    <View style={[styles.container, { backgroundColor: GLASS.backgroundColor(colors.surface), borderColor: GLASS.borderColor }]}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{labelText}</Text>
      <Text style={[styles.time, { color: colors.text }]}>{formatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    marginHorizontal: 24,
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
