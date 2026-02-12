import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { GradientButton } from './ui/GradientButton';
import { t } from '../lib/i18n';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    icon: 'flash',
    titleKey: 'onboardingTitle1' as const,
    subtitleKey: 'onboardingDesc1' as const,
  },
  {
    icon: 'globe',
    titleKey: 'onboardingTitle2' as const,
    subtitleKey: 'onboardingDesc2' as const,
  },
  {
    icon: 'dna' as string,
    iconFamily: 'mci' as const,
    titleKey: 'onboardingTitle3' as const,
    subtitleKey: 'onboardingDesc3' as const,
  },
  {
    icon: 'people',
    titleKey: 'onboardingTitle4' as const,
    subtitleKey: 'onboardingDesc4' as const,
  },
];

export function Onboarding({ onComplete }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
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
        <AnimatedIcon
          name={slide.icon}
          family={slide.iconFamily ?? 'ionicons'}
          size={64}
          color={colors.accent}
          animation="bounce"
        />
        <Text style={styles.title}>{t(slide.titleKey)}</Text>
        <Text style={styles.subtitle}>{t(slide.subtitleKey)}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            i === currentSlide ? (
              <LinearGradient
                key={i}
                colors={[colors.accent, colors.optionB]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.dot, styles.dotActive]}
              />
            ) : (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: colors.surface }]}
              />
            )
          ))}
        </View>

        <GradientButton
          title={isLast ? t('start') : t('continue')}
          onPress={() => {
            if (isLast) {
              onComplete();
            } else {
              setCurrentSlide(currentSlide + 1);
            }
          }}
          style={{ width: '100%' }}
        />

        {!isLast && (
          <Pressable onPress={onComplete}>
            <Text style={styles.skipText}>{t('skip')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
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
  },
  dotActive: {
    width: 24,
  },
  skipText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
