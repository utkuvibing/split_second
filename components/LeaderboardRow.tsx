import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { LeaderboardEntry, getPlayerName } from '../lib/leaderboard';
import { t } from '../lib/i18n';

const RANK_EMOJIS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

export function LeaderboardRow({ entry, isCurrentUser }: Props) {
  const rankEmoji = RANK_EMOJIS[entry.rank];

  return (
    <View style={[styles.container, isCurrentUser && styles.highlighted]}>
      <View style={styles.rankContainer}>
        {rankEmoji ? (
          <Text style={styles.rankEmoji}>{rankEmoji}</Text>
        ) : (
          <Text style={styles.rankNumber}>#{entry.rank}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, isCurrentUser && styles.nameHighlighted]} numberOfLines={1}>
          {isCurrentUser ? t('leaderboardYou') : getPlayerName(entry.user_id)}
        </Text>
        <Text style={styles.stats}>
          {t('leaderboardVotes', { count: entry.total_votes })}
        </Text>
      </View>
      <View style={styles.streakContainer}>
        <Text style={styles.streakFire}>🔥</Text>
        <Text style={[styles.streakNumber, isCurrentUser && styles.nameHighlighted]}>
          {entry.current_streak}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  highlighted: {
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  rankContainer: {
    width: 36,
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 22,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  nameHighlighted: {
    color: Colors.accent,
  },
  stats: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakFire: {
    fontSize: 16,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.warning,
  },
});
