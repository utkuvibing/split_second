import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  questionText: string;
  optionA: string;
  optionB: string;
  percentA: number;
  percentB: number;
  userChoice: 'a' | 'b';
}

export const ShareCard = forwardRef<View, Props>(({
  questionText,
  optionA,
  optionB,
  percentA,
  percentB,
  userChoice,
}, ref) => {
  const colors = useTheme();
  const dynamicStyles = createStyles(colors);

  return (
    <View ref={ref} style={dynamicStyles.card} collapsable={false}>
      <Text style={dynamicStyles.brand}>SPLIT SECOND</Text>
      <Text style={dynamicStyles.question}>{questionText}</Text>
      <View style={styles.options}>
        <View style={[dynamicStyles.optionRow, userChoice === 'a' && dynamicStyles.selectedOption]}>
          <View style={[styles.bar, { width: `${percentA}%`, backgroundColor: colors.optionA }]} />
          <Text style={dynamicStyles.optionText}>{optionA}</Text>
          <Text style={[styles.percent, { color: colors.optionA }]}>{percentA}%</Text>
        </View>
        <View style={[dynamicStyles.optionRow, userChoice === 'b' && dynamicStyles.selectedOption]}>
          <View style={[styles.bar, { width: `${percentB}%`, backgroundColor: colors.optionB }]} />
          <Text style={dynamicStyles.optionText}>{optionB}</Text>
          <Text style={[styles.percent, { color: colors.optionB }]}>{percentB}%</Text>
        </View>
      </View>
      <Text style={dynamicStyles.footer}>{t('shareCardFooter')}</Text>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    width: 340,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.surface,
    ...SHADOW.lg,
  },
  brand: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 3,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  optionRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: colors.text,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  footer: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.15,
    borderRadius: 12,
  },
  percent: {
    fontSize: 18,
    fontWeight: '700',
  },
});
