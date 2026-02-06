import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';

interface Props {
  emoji: string;
  value: string;
  label: string;
}

export function StatCard({ emoji, value, label }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
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
