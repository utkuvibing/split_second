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
  onImageShare?: () => void;
}

export function ShareButton({ onPress, onImageShare }: Props) {
  const colors = useTheme();
  const scale = useSharedValue(1);
  const scaleImg = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedStyleImg = useAnimatedStyle(() => ({
    transform: [{ scale: scaleImg.value }],
  }));

  return (
    <Animated.View entering={FadeIn.delay(1400).duration(400)} style={styles.row}>
      <AnimatedPressable
        style={[styles.button, styles.primaryButton, { backgroundColor: colors.accent }, animatedStyle]}
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>{t('share')}</Text>
      </AnimatedPressable>
      {onImageShare && (
        <AnimatedPressable
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: colors.surface, borderColor: colors.accent },
            animatedStyleImg
          ]}
          onPressIn={() => {
            scaleImg.value = withSpring(0.95);
          }}
          onPressOut={() => {
            scaleImg.value = withSpring(1);
          }}
          onPress={onImageShare}
        >
          <Text style={[styles.secondaryText, { color: colors.accent }]}>{t('story')}</Text>
        </AnimatedPressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
