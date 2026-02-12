import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  emoji?: string;
  icon?: string;
  iconFamily?: 'ionicons' | 'mci';
  value: string;
  label: string;
}

export function StatCard({ emoji, icon, iconFamily, value, label }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, SHADOW.sm]}>
      {icon ? (
        iconFamily === 'mci' ? (
          <MaterialCommunityIcons name={icon as any} size={20} color={colors.accent} />
        ) : (
          <Ionicons name={icon as any} size={20} color={colors.accent} />
        )
      ) : (
        <Text style={styles.emoji}>{emoji}</Text>
      )}
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  emoji: {
    fontSize: 20,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
