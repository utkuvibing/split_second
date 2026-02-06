import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { VoteHistoryItem } from '../lib/history';
import { getDateLocale } from '../lib/i18n';

interface Props {
  item: VoteHistoryItem;
}

export function HistoryCard({ item }: Props) {
  const percentA = item.total > 0 ? Math.round((item.count_a / item.total) * 100) : 0;
  const percentB = item.total > 0 ? Math.round((item.count_b / item.total) * 100) : 0;
  const userPercent = item.user_choice === 'a' ? percentA : percentB;
  const userOptionText = item.user_choice === 'a' ? item.option_a : item.option_b;
  const isMajority = userPercent >= 50;

  const dateStr = new Date(item.scheduled_date).toLocaleDateString(getDateLocale(), {
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={styles.card}>
      <View style={styles.dateRow}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Text style={styles.question} numberOfLines={2}>{item.question_text}</Text>
      <View style={styles.resultRow}>
        <Text style={styles.choice}>
          {'\u2713'} {userOptionText}
        </Text>
        <Text style={[styles.percent, { color: isMajority ? Colors.success : Colors.warning }]}>
          %{userPercent}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.barA, { width: `${percentA}%` }]} />
        <View style={[styles.barB, { width: `${percentB}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  category: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choice: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  percent: {
    fontSize: 16,
    fontWeight: '700',
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  barA: {
    height: '100%',
    backgroundColor: Colors.optionA,
  },
  barB: {
    height: '100%',
    backgroundColor: Colors.optionB,
  },
});
