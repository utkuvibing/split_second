import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { RADIUS, SHADOW, SPRING } from '../../constants/ui';
import { Typography } from '../../constants/typography';
import { hapticButton } from '../../lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  colors?: [string, string];
  glow?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

export function GradientButton({
  title,
  onPress,
  disabled,
  colors: gradientColors,
  glow,
  style,
  small,
}: Props) {
  const defaultColors: [string, string] = ['#E53170', '#4ECDC4'];
  const btnColors = gradientColors ?? defaultColors;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, SPRING.button);
      hapticButton();
    }
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING.button);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        glow && !disabled ? SHADOW.glow(btnColors[0]) : SHADOW.sm,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={btnColors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradient, small && styles.gradientSmall]}
      >
        <Text style={[styles.text, small && styles.textSmall]}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
  },
  text: {
    ...Typography.button,
  },
  textSmall: {
    fontSize: 13,
  },
});
