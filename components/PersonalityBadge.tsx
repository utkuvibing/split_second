import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { PersonalityType } from '../lib/personality';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  personality: PersonalityType;
}

export function PersonalityBadge({ personality }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.badge}>
      <Text style={styles.emoji}>{personality.emoji}</Text>
      <Text style={styles.title}>
        {t(personality.titleKeyTr as TranslationKey)}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  emoji: {
    fontSize: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
});
