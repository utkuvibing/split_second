import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { VoteHistoryItem } from '../lib/history';
import { getDateLocale } from '../lib/i18n';

interface Props {
  item: VoteHistoryItem;
}

export function HistoryCard({ item }: Props) {
  const colors = useTheme();
  const percentA = item.total > 0 ? Math.round((item.count_a / item.total) * 100) : 0;
  const percentB = item.total > 0 ? Math.round((item.count_b / item.total) * 100) : 0;
  const userPercent = item.user_choice === 'a' ? percentA : percentB;
  const userOptionText = item.user_choice === 'a' ? item.option_a : item.option_b;
  const isMajority = userPercent >= 50;

  const dateStr = new Date(item.scheduled_date).toLocaleDateString(getDateLocale(), {
    day: 'numeric',
    month: 'short',
  });

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.card}>
      <View style={styles.dateRow}>
        <Text style={dynamicStyles.date}>{dateStr}</Text>
        <Text style={dynamicStyles.category}>{item.category}</Text>
      </View>
      <Text style={dynamicStyles.question} numberOfLines={2}>{item.question_text}</Text>
      <View style={styles.resultRow}>
        <Text style={dynamicStyles.choice}>
          {'\u2713'} {userOptionText}
        </Text>
        <Text style={[styles.percent, { color: isMajority ? colors.success : colors.warning }]}>
          %{userPercent}
        </Text>
      </View>
      <View style={dynamicStyles.barContainer}>
        <View style={[styles.barA, { width: `${percentA}%`, backgroundColor: colors.optionA }]} />
        <View style={[styles.barB, { width: `${percentB}%`, backgroundColor: colors.optionB }]} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  category: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  choice: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
});

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    fontSize: 16,
    fontWeight: '700',
  },
  barA: {
    height: '100%',
  },
  barB: {
    height: '100%',
  },
});
