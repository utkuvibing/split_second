import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#E53170', '#FBBF24', '#4ADE80', '#A78BFA'];
const EMOJIS = ['🎉', '🔥', '⭐', '🎊', '✨', '💪'];
const PARTICLE_COUNT = 20;

function Particle({ index }: { index: number }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  const startX = Math.random() * width;
  const duration = 2000 + Math.random() * 1000;
  const delay = Math.random() * 500;

  useEffect(() => {
    translateY.value = withDelay(delay,
      withTiming(height + 50, { duration, easing: Easing.in(Easing.quad) })
    );
    translateX.value = withDelay(delay,
      withTiming((Math.random() - 0.5) * 200, { duration })
    );
    rotate.value = withDelay(delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration })
    );
    opacity.value = withDelay(delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const isEmoji = index % 3 === 0;

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: startX },
        animStyle,
      ]}
    >
      {isEmoji ? (
        <Text style={styles.emoji}>{EMOJIS[index % EMOJIS.length]}</Text>
      ) : (
        <View
          style={[
            styles.confettiPiece,
            { backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length] },
          ]}
        />
      )}
    </Animated.View>
  );
}

export function Confetti() {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  particle: {
    position: 'absolute',
    top: -20,
  },
  confettiPiece: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  emoji: {
    fontSize: 20,
  },
});
