import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  timeRemaining: number;
  status: 'active' | 'upcoming';
  onPress: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function LiveEventBanner({ timeRemaining, status, onPress }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (status === 'active') {
      pulseOpacity.value = withRepeat(
        withTiming(0.4, { duration: 800 }),
        -1,
        true
      );
    }
  }, [status]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <Pressable style={styles.banner} onPress={onPress}>
      {status === 'active' && (
        <Animated.View style={[styles.liveDot, dotStyle]} />
      )}
      <Text style={styles.label}>
        {status === 'active' ? t('liveEventActive') : t('liveEventUpcoming')}
      </Text>
      <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.warning + '20',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginTop: 4,
    ...SHADOW.sm,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
});
