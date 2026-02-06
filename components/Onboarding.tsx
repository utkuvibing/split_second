import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { t } from '../lib/i18n';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '⚡',
    titleKey: 'onboardingTitle1' as const,
    subtitleKey: 'onboardingDesc1' as const,
  },
  {
    emoji: '🌍',
    titleKey: 'onboardingTitle2' as const,
    subtitleKey: 'onboardingDesc2' as const,
  },
];

export function Onboarding({ onComplete }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLast = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      <Animated.View
        key={currentSlide}
        entering={SlideInRight.duration(300)}
        style={styles.slideContent}
      >
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{t(slide.titleKey)}</Text>
        <Text style={styles.subtitle}>{t(slide.subtitleKey)}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentSlide && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          style={styles.button}
          onPress={() => {
            if (isLast) {
              onComplete();
            } else {
              setCurrentSlide(currentSlide + 1);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isLast ? t('start') : t('continue')}
          </Text>
        </Pressable>

        {!isLast && (
          <Pressable onPress={onComplete}>
            <Text style={styles.skipText}>{t('skip')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
