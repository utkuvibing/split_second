import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../lib/i18n';

interface Props {
  focused: boolean;
  color: string;
  accentColor: string;
}

export function TodayTabIcon({ focused, color, accentColor }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
    } else {
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [focused]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulse.value * 0.4,
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  return (
    <Animated.View style={styles.wrapper}>
      {/* Glow pulse behind pill */}
      {focused && (
        <Animated.View
          style={[
            styles.glow,
            { backgroundColor: accentColor },
            glowStyle,
          ]}
        />
      )}
      {/* Main pill */}
      <LinearGradient
        colors={
          focused
            ? [accentColor, accentColor + 'AA']
            : ['transparent', 'transparent']
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.pill}
      >
        <Ionicons
          name={focused ? 'flash' : 'flash-outline'}
          size={24}
          color={focused ? '#FFF' : color}
        />
        <Text
          style={[
            styles.label,
            { color: focused ? '#FFF' : color },
          ]}
        >
          {t('tabToday')}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const PILL_W = 64;
const PILL_H = 58;

const styles = StyleSheet.create({
  wrapper: {
    width: PILL_W,
    height: PILL_H,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glow: {
    position: 'absolute',
    width: PILL_W,
    height: PILL_H,
    borderRadius: 16,
  },
  pill: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
});
