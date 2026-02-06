import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { BadgeDef, BadgeContext } from '../lib/badges';
import { t } from '../lib/i18n';

interface Props {
  badge: BadgeDef;
  unlocked: boolean;
  context?: BadgeContext | null;
  delay?: number;
}

export function BadgeCard({ badge, unlocked, context, delay = 0 }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const progress = context && badge.progress ? badge.progress(context) : null;

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      style={[styles.container, !unlocked && styles.locked]}
    >
      <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>
        {badge.emoji}
      </Text>
      <Text style={[styles.title, !unlocked && styles.textLocked]} numberOfLines={1}>
        {t(badge.titleKey as any)}
      </Text>
      {unlocked ? (
        <Text style={styles.desc} numberOfLines={2}>
          {t(badge.descKey as any)}
        </Text>
      ) : progress ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.current / progress.target) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.current}/{progress.target}
          </Text>
        </View>
      ) : (
        <Text style={styles.desc} numberOfLines={2}>
          {t(badge.descKey as any)}
        </Text>
      )}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    minHeight: 100,
  },
  locked: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 28,
  },
  emojiLocked: {
    opacity: 0.4,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  textLocked: {
    color: colors.textMuted,
  },
  desc: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    gap: 2,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 9,
    color: colors.textMuted,
  },
});
