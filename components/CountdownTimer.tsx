import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '../lib/themeContext';
import { hapticTick } from '../lib/haptics';

interface Props {
  timeLeft: number;
  progress: number; // 1.0 → 0.0
}

export function CountdownTimer({ timeLeft, progress }: Props) {
  const colors = useTheme();
  const animatedWidth = useSharedValue(progress);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    animatedWidth.value = withTiming(progress, {
      duration: 950,
      easing: Easing.linear,
    });
  }, [progress]);

  // Haptic tick at 3, 2, 1 seconds
  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 3) {
      hapticTick();
    }
  }, [timeLeft]);

  // Pulse animation when urgent
  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 3) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [timeLeft]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  const textPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const isUrgent = timeLeft <= 3;

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.timeText,
          { color: isUrgent ? colors.accent : colors.text },
          textPulseStyle,
        ]}
      >
        {timeLeft}
      </Animated.Text>
      <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: isUrgent ? colors.accent : colors.text },
            barStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '800',
  },
  barTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
