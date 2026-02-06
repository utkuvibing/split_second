import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { getNextMilestone } from '../lib/streaks';
import { t } from '../lib/i18n';

interface Props {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: Props) {
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.streakRow}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>{t('dayStreak')}</Text>
      </View>
      {nextMilestone && (
        <Text style={styles.milestone}>
          {t('nextGoal', { milestone: nextMilestone })}
        </Text>
      )}
      {longestStreak > currentStreak && (
        <Text style={styles.record}>
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
  fireEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.warning,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  milestone: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  record: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
