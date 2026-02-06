import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { t } from '../lib/i18n';

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
  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <Text style={styles.brand}>SPLIT SECOND</Text>
      <Text style={styles.question}>{questionText}</Text>
      <View style={styles.options}>
        <View style={[styles.optionRow, userChoice === 'a' && styles.selectedOption]}>
          <View style={[styles.bar, { width: `${percentA}%`, backgroundColor: Colors.optionA }]} />
          <Text style={styles.optionText}>{optionA}</Text>
          <Text style={[styles.percent, { color: Colors.optionA }]}>{percentA}%</Text>
        </View>
        <View style={[styles.optionRow, userChoice === 'b' && styles.selectedOption]}>
          <View style={[styles.bar, { width: `${percentB}%`, backgroundColor: Colors.optionB }]} />
          <Text style={styles.optionText}>{optionB}</Text>
          <Text style={[styles.percent, { color: Colors.optionB }]}>{percentB}%</Text>
        </View>
      </View>
      <Text style={styles.footer}>{t('shareCardFooter')}</Text>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    width: 340,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  brand: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 2,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  options: {
    gap: 10,
  },
  optionRow: {
    backgroundColor: Colors.surface,
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
    borderColor: Colors.text,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.15,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  percent: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
