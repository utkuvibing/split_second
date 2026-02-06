import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { getBadgeById } from '../lib/badges';
import { t } from '../lib/i18n';

interface Props {
  badgeId: string;
  onDone?: () => void;
}

export function BadgeUnlockToast({ badgeId, onDone }: Props) {
  const colors = useTheme();
  const badge = getBadgeById(badgeId);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    // Container fades in
    opacity.value = withTiming(1, { duration: 300 });
    // Container scales up
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    // Emoji bounces in with delay
    emojiScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      )
    );

    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
      scale.value = withTiming(0.8, { duration: 300 });
      if (onDone) setTimeout(onDone, 350);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!badge) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: colors.surface, borderColor: colors.accent },
      ]}
    >
      <Animated.View style={emojiStyle}>
        <Text style={styles.emoji}>{badge.emoji}</Text>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={[styles.unlocked, { color: colors.accent }]}>
          {t('badgeUnlocked')}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {t(badge.titleKey as any)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    marginHorizontal: 24,
  },
  emoji: {
    fontSize: 36,
  },
  textContainer: {
    gap: 2,
  },
  unlocked: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
