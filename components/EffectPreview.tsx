import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Props {
  effectId: string;
  size?: number;
}

function MiniConfetti({ size }: { size: number }) {
  const particles = ['🎉', '✨', '🎊', '⭐', '💫', '🔥'];
  return (
    <View style={[styles.effectBox, { width: size, height: size }]}>
      {particles.map((emoji, i) => (
        <ConfettiParticle key={i} emoji={emoji} index={i} size={size} />
      ))}
    </View>
  );
}

function ConfettiParticle({ emoji, index, size }: { emoji: string; index: number; size: number }) {
  const translateY = useSharedValue(size * 0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 200;
    translateY.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(size * 0.3, { duration: 0 }),
          withTiming(-size * 0.1, { duration: 800, easing: Easing.out(Easing.quad) }),
          withTiming(size * 0.4, { duration: 600, easing: Easing.in(Easing.quad) }),
        ),
        -1,
      )
    );
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const left = (index / 6) * size * 0.8 + size * 0.1;

  return (
    <Animated.Text style={[styles.particle, { left, fontSize: size / 5 }, style]}>
      {emoji}
    </Animated.Text>
  );
}

function LightningFlash({ size }: { size: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, { duration: 100 }),
        withTiming(0.2, { duration: 100 }),
        withTiming(1, { duration: 80 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.effectBox, { width: size, height: size }]}>
      <Animated.View style={[styles.flashOverlay, { borderRadius: size / 4 }, style]}>
        <Text style={{ fontSize: size / 2 }}>⚡</Text>
      </Animated.View>
    </View>
  );
}

function FloatingHearts({ size }: { size: number }) {
  const hearts = ['❤️', '💕', '💗', '💖', '💘'];
  return (
    <View style={[styles.effectBox, { width: size, height: size }]}>
      {hearts.map((heart, i) => (
        <FloatingHeart key={i} emoji={heart} index={i} size={size} />
      ))}
    </View>
  );
}

function FloatingHeart({ emoji, index, size }: { emoji: string; index: number; size: number }) {
  const translateY = useSharedValue(size * 0.6);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const delay = index * 300;
    translateY.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(size * 0.6, { duration: 0 }),
          withTiming(-size * 0.1, { duration: 1200, easing: Easing.out(Easing.quad) }),
        ),
        -1,
      )
    );
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(1, { duration: 300 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      )
    );
    scale.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 0 }),
          withTiming(1, { duration: 400 }),
          withTiming(0.8, { duration: 800 }),
        ),
        -1,
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const left = (index / 5) * size * 0.7 + size * 0.15;

  return (
    <Animated.Text style={[styles.particle, { left, fontSize: size / 4 }, style]}>
      {emoji}
    </Animated.Text>
  );
}

function DefaultSwipe({ size }: { size: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(size * 0.15, { duration: 0 }),
        withTiming(-size * 0.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(size * 0.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 0 }),
        withTiming(0.8, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.effectBox, { width: size, height: size }]}>
      <Animated.Text style={[{ fontSize: size / 2.5 }, style]}>👆</Animated.Text>
    </View>
  );
}

export function EffectPreview({ effectId, size = 80 }: Props) {
  switch (effectId) {
    case 'confetti':
      return <MiniConfetti size={size} />;
    case 'lightning':
      return <LightningFlash size={size} />;
    case 'hearts':
      return <FloatingHearts size={size} />;
    default:
      return <DefaultSwipe size={size} />;
  }
}

const styles = StyleSheet.create({
  effectBox: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
  flashOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
