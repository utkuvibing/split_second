import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { DailyCountdown } from './DailyCountdown';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { t } from '../lib/i18n';

export function NoQuestion() {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <AnimatedIcon name="hourglass" size={48} color={colors.textMuted} animation="pulse" />
      <Text style={[styles.title, { color: colors.text }]}>{t('noQuestionToday')}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t('comeBackTomorrow')}
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
