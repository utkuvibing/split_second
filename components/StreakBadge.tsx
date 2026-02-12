import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { getNextMilestone } from '../lib/streaks';
import { SHADOW } from '../constants/ui';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { t } from '../lib/i18n';

interface Props {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: Props) {
  const colors = useTheme();
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[styles.container, SHADOW.sm]}>
      <View style={styles.streakRow}>
        <AnimatedIcon name="fire" family="mci" size={28} color={colors.warning} animation={currentStreak > 7 ? 'pulse' : 'none'} />
        <Text style={[styles.streakNumber, { color: colors.warning }]}>{currentStreak}</Text>
        <Text style={[styles.streakLabel, { color: colors.text }]}>{t('dayStreak')}</Text>
      </View>
      {nextMilestone && (
        <Text style={[styles.milestone, { color: colors.textMuted }]}>
          {t('nextGoal', { milestone: nextMilestone })}
        </Text>
      )}
      {longestStreak > currentStreak && (
        <Text style={[styles.record, { color: colors.textMuted }]}>
          {t('longestStreakLabel', { streak: longestStreak })}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  milestone: {
    fontSize: 13,
  },
  record: {
    fontSize: 12,
  },
});
