import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { PersonalityType, PersonalityAxes } from '../lib/personality';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  personality: PersonalityType;
  axes: PersonalityAxes;
  isPremium: boolean;
}

function AxisBar({ label, value, color }: { label: string; value: number; color: string }) {
  const colors = useTheme();
  const barStyles = createBarStyles(colors);
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.barBg}>
        <View style={[barStyles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[barStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

export function PersonalityDetailCard({ personality, axes, isPremium }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{personality.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {t(personality.titleKeyTr as TranslationKey)}
          </Text>
          <Text style={styles.desc}>
            {t(personality.descKeyTr as TranslationKey)}
          </Text>
        </View>
      </View>

      {isPremium ? (
        <View style={styles.axes}>
          <AxisBar label={t('personalityConformity')} value={axes.conformity} color={colors.optionA} />
          <AxisBar label={t('personalitySpeed')} value={axes.speed} color={colors.accent} />
          <AxisBar label={t('personalityDiversity')} value={axes.diversity} color={colors.success} />
          <AxisBar label={t('personalityCourage')} value={axes.courage} color={colors.warning} />
        </View>
      ) : (
        <View style={styles.premiumHint}>
          <Text style={styles.premiumHintText}>
            {t('premiumUnlock')}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 40,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  desc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  axes: {
    gap: 10,
  },
  premiumHint: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  premiumHintText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

const createBarStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    width: 70,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 28,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
});
