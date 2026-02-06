import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  emoji: string;
  value: string;
  label: string;
}

export function StatCard({ emoji, value, label }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
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
    color: Colors.text,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
