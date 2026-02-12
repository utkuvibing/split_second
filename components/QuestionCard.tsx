import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../lib/themeContext';
import { Typography } from '../constants/typography';
import { RADIUS, SHADOW, SPRING } from '../constants/ui';
import { hapticButton } from '../lib/haptics';
import { Question } from '../types/database';
import { t } from '../lib/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Props {
  question: Question;
  onVote: (choice: 'a' | 'b') => void;
  disabled: boolean;
}

function OptionButton({
  label,
  color,
  onPress,
  disabled,
}: {
  label: string;
  color: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.optionButton, { backgroundColor: color }, SHADOW.md, animatedStyle]}
      onPressIn={() => {
        if (!disabled) {
          scale.value = withSpring(0.95, SPRING.button);
          hapticButton();
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING.button);
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.optionText}>{label}</Text>
    </AnimatedPressable>
  );
}

export function QuestionCard({ question, onVote, disabled }: Props) {
  const colors = useTheme();
  const translateX = useSharedValue(0);

  const submitVote = (choice: 'a' | 'b') => {
    if (!disabled) onVote(choice);
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left = Option A
        translateX.value = withSpring(0);
        runOnJS(submitVote)('a');
      } else if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right = Option B
        translateX.value = withSpring(0);
        runOnJS(submitVote)('b');
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value * 0.3 },
      { rotate: `${interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-8, 0, 8])}deg` },
    ],
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [0.6, 0]),
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 0.6]),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, cardAnimatedStyle]}>
        {/* Swipe overlays */}
        <Animated.View style={[styles.swipeOverlay, styles.leftOverlay, { backgroundColor: colors.optionA }, leftOverlayStyle]}>
          <Text style={[styles.swipeHint, { color: colors.text }]}>{question.option_a}</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeOverlay, styles.rightOverlay, { backgroundColor: colors.optionB }, rightOverlayStyle]}>
          <Text style={[styles.swipeHint, { color: colors.text }]}>{question.option_b}</Text>
        </Animated.View>

        <Text style={[styles.questionText, { borderColor: colors.accent + '33' }]}>{question.question_text}</Text>

        <View style={styles.swipeInstructions}>
          <Text style={[styles.swipeText, { color: colors.textMuted }]}>{t('swipeHint')}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <OptionButton
            label={question.option_a}
            color={colors.optionA}
            onPress={() => onVote('a')}
            disabled={disabled}
          />
          <OptionButton
            label={question.option_b}
            color={colors.optionB}
            onPress={() => onVote('b')}
            disabled={disabled}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  questionText: {
    ...Typography.title,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.3,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  optionText: {
    ...Typography.button,
    fontSize: 18,
  },
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    zIndex: 1,
  },
  leftOverlay: {
    left: 0,
  },
  rightOverlay: {
    left: 0,
  },
  swipeHint: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  swipeInstructions: {
    alignItems: 'center',
  },
  swipeText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
