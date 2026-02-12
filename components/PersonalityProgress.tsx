import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { PERSONALITY_UNLOCK_VOTES } from '../lib/personality';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { t } from '../lib/i18n';

interface Props {
  totalVotes: number;
}

export function PersonalityProgress({ totalVotes }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const remaining = Math.max(0, PERSONALITY_UNLOCK_VOTES - totalVotes);
  const progress = Math.min(1, totalVotes / PERSONALITY_UNLOCK_VOTES);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <AnimatedIcon name="crystal-ball" family="mci" size={36} color={colors.accent} animation="pulse" />
      <Text style={styles.lockedText}>
        {t('personalityLocked', { remaining: String(remaining) })}
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {t('personalityProgress', {
          current: String(totalVotes),
          target: String(PERSONALITY_UNLOCK_VOTES),
        })}
      </Text>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  lockedText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  barBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
