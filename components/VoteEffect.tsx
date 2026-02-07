import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  effectId: string;
}

// --- Confetti (reuses same logic as Confetti.tsx but scoped here) ---

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#E53170', '#FBBF24', '#4ADE80', '#A78BFA'];
const CONFETTI_EMOJIS = ['🎉', '🔥', '⭐', '🎊', '✨', '💪'];
const CONFETTI_COUNT = 20;

function ConfettiParticle({ index }: { index: number }) {
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
    <Animated.View style={[styles.particle, { left: startX }, animStyle]}>
      {isEmoji ? (
        <Text style={styles.confettiEmoji}>{CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length]}</Text>
      ) : (
        <View style={[styles.confettiPiece, {
          backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        }]} />
      )}
    </Animated.View>
  );
}

function ConfettiEffect() {
  return (
    <>
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}
    </>
  );
}

// --- Lightning: quick yellow flash ---

function LightningEffect() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Two quick flashes then fade out
    opacity.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withTiming(0.1, { duration: 80 }),
      withTiming(0.9, { duration: 60 }),
      withTiming(0, { duration: 300 }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.flashOverlay, animStyle]}>
      <Text style={styles.lightningEmoji}>⚡</Text>
    </Animated.View>
  );
}

// --- Hearts: 15 hearts rising from bottom ---

const HEARTS = ['❤️', '💕', '💗', '💖', '💘'];
const HEART_COUNT = 15;

function HeartParticle({ index }: { index: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const startX = Math.random() * (width - 40) + 20;
  const duration = 1800 + Math.random() * 800;
  const delay = Math.random() * 600;

  useEffect(() => {
    // Rise from bottom to top
    translateY.value = withDelay(delay,
      withTiming(-height * 0.7, { duration, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(duration * 0.5,
          withTiming(0, { duration: duration * 0.3 })
        ),
      )
    );
    scale.value = withDelay(delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.7, { duration: duration - 300 }),
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.heartParticle, { left: startX }, animStyle]}>
      {HEARTS[index % HEARTS.length]}
    </Animated.Text>
  );
}

function HeartsEffect() {
  return (
    <>
      {Array.from({ length: HEART_COUNT }).map((_, i) => (
        <HeartParticle key={i} index={i} />
      ))}
    </>
  );
}

// --- Main VoteEffect ---

export function VoteEffect({ effectId }: Props) {
  if (!effectId || effectId === 'default') {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {effectId === 'confetti' && <ConfettiEffect />}
      {effectId === 'lightning' && <LightningEffect />}
      {effectId === 'hearts' && <HeartsEffect />}
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
  confettiEmoji: {
    fontSize: 20,
  },
  confettiPiece: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 220, 50, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightningEmoji: {
    fontSize: 80,
  },
  heartParticle: {
    position: 'absolute',
    bottom: 0,
    fontSize: 24,
  },
});
