import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { PersonalityType } from '../lib/personality';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { GradientButton } from './ui/GradientButton';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  visible: boolean;
  personality: PersonalityType;
  onClose: () => void;
}

export function PersonalityRevealModal({ visible, personality, onClose }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [phase, setPhase] = useState<'analyzing' | 'reveal'>('analyzing');

  const bgOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      setPhase('analyzing');
      bgOpacity.value = 0;
      emojiScale.value = 0;
      textOpacity.value = 0;
      descOpacity.value = 0;
      return;
    }

    // Phase 1: analyzing
    bgOpacity.value = withTiming(1, { duration: 300 });

    const timer = setTimeout(() => {
      setPhase('reveal');
      // Phase 2: emoji zoom in
      emojiScale.value = withSequence(
        withSpring(1.4, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      // Phase 3: title
      textOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
      // Phase 4: description
      descOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    }, 1500);

    return () => clearTimeout(timer);
  }, [visible]);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, bgStyle]}>
        <View style={styles.content}>
          {phase === 'analyzing' ? (
            <View style={styles.analyzingContainer}>
              <AnimatedIcon name="crystal-ball" family="mci" size={60} color="#ffffff" animation="pulse" />
              <Text style={styles.analyzingText}>{t('personalityAnalyzing')}</Text>
            </View>
          ) : (
            <View style={styles.revealContainer}>
              <Text style={[styles.revealedLabel, { color: colors.accent }]}>
                {t('personalityRevealed')}
              </Text>
              <Animated.View style={emojiStyle}>
                <Text style={styles.revealEmoji}>{personality.emoji}</Text>
              </Animated.View>
              <Animated.View style={titleStyle}>
                <Text style={styles.revealTitle}>
                  {t(personality.titleKeyTr as TranslationKey)}
                </Text>
              </Animated.View>
              <Animated.View style={descStyle}>
                <Text style={styles.revealDesc}>
                  {t(personality.descKeyTr as TranslationKey)}
                </Text>
                <GradientButton title={t('continue')} onPress={onClose} style={{ marginTop: 24 }} />
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
  },
  analyzingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  analyzingEmoji: {
    fontSize: 60,
  },
  analyzingText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  revealContainer: {
    alignItems: 'center',
    gap: 12,
  },
  revealedLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  revealEmoji: {
    fontSize: 80,
  },
  revealTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  revealDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
