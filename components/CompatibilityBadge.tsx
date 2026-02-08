import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { getCompatibilityKey } from '../lib/friends';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  score: number | null;
}

function getScoreColor(score: number, colors: ThemeColors): string {
  if (score <= 20) return colors.warning;
  if (score <= 40) return colors.textMuted;
  if (score <= 60) return colors.text;
  if (score <= 80) return colors.success;
  return colors.accent;
}

export function CompatibilityBadge({ score }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (score == null) return null;

  const color = getScoreColor(score, colors);
  const labelKey = getCompatibilityKey(score);

  return (
    <View style={styles.badge}>
      <Text style={[styles.score, { color }]}>{score}%</Text>
      <Text style={[styles.label, { color }]}>{t(labelKey as TranslationKey)}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
  },
});
