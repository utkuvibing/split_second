import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPRING } from '../../constants/ui';

type IonName = keyof typeof Ionicons.glyphMap;
type MCIName = keyof typeof MaterialCommunityIcons.glyphMap;

interface Props {
  name: string;
  size?: number;
  color?: string;
  animation?: 'none' | 'pulse' | 'bounce';
  family?: 'ionicons' | 'mci';
}

export function AnimatedIcon({
  name,
  size = 24,
  color = '#FFFFFE',
  animation = 'none',
  family = 'ionicons',
}: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animation === 'pulse') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else if (animation === 'bounce') {
      scale.value = withSequence(
        withSpring(1.3, SPRING.bounce),
        withSpring(1, { damping: 12, stiffness: 100 })
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = family === 'mci' ? MaterialCommunityIcons : Ionicons;

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent name={name as any} size={size} color={color} />
    </Animated.View>
  );
}
