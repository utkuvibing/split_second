import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { t } from '../lib/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  onPress: () => void;
}

export function ChallengeButton({ onPress }: Props) {
  const colors = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.delay(1600).duration(400)}>
      <AnimatedPressable
        style={[
          styles.button,
          animatedStyle,
          { backgroundColor: colors.surface, borderColor: colors.accent },
        ]}
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {t('challengeFriend')}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
