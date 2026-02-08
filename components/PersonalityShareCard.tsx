import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { PersonalityType, PersonalityAxes } from '../lib/personality';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  personality: PersonalityType;
  axes: PersonalityAxes;
}

export const PersonalityShareCard = forwardRef<View, Props>(({ personality, axes }, ref) => {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <Text style={styles.brand}>SPLIT SECOND</Text>
      <Text style={styles.label}>{t('personalityShareTitle')}</Text>
      <Text style={styles.emoji}>{personality.emoji}</Text>
      <Text style={styles.title}>
        {t(personality.titleKeyTr as TranslationKey)}
      </Text>
      <Text style={styles.desc}>
        {t(personality.descKeyTr as TranslationKey)}
      </Text>
      <View style={styles.axes}>
        <AxisRow label={t('personalityConformity')} value={axes.conformity} color={colors.optionA} />
        <AxisRow label={t('personalitySpeed')} value={axes.speed} color={colors.accent} />
        <AxisRow label={t('personalityDiversity')} value={axes.diversity} color={colors.success} />
        <AxisRow label={t('personalityCourage')} value={axes.courage} color={colors.warning} />
      </View>
      <Text style={styles.footer}>{t('personalityShareFooter')}</Text>
    </View>
  );
});

PersonalityShareCard.displayName = 'PersonalityShareCard';

function AxisRow({ label, value, color }: { label: string; value: number; color: string }) {
  const colors = useTheme();
  return (
    <View style={axisStyles.row}>
      <Text style={[axisStyles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={[axisStyles.barBg, { backgroundColor: colors.background }]}>
        <View style={[axisStyles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[axisStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    width: 340,
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface,
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 2,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  axes: {
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

const axisStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    width: 65,
    fontSize: 11,
    fontWeight: '600',
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    width: 24,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
});
