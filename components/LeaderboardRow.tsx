import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { LeaderboardEntry, getPlayerName } from '../lib/leaderboard';
import { getFrameById } from '../lib/cosmetics';
import { AvatarDisplay } from './AvatarDisplay';
import { RADIUS, SHADOW } from '../constants/ui';
import { t } from '../lib/i18n';

const RANK_EMOJIS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  frameId?: string;
}

export function LeaderboardRow({ entry, isCurrentUser, frameId }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const rankEmoji = RANK_EMOJIS[entry.rank];

  // Render frame border for the current user
  const frame = frameId ? getFrameById(frameId) : null;
  const frameBorderColor = frame && frame.borderColors.length > 0 ? frame.borderColors[0] : undefined;

  return (
    <View style={[
      styles.container,
      isCurrentUser && styles.highlighted,
      isCurrentUser && frameBorderColor && { borderColor: frameBorderColor },
    ]}>
      <View style={styles.rankContainer}>
        {rankEmoji ? (
          <Text style={styles.rankEmoji}>{rankEmoji}</Text>
        ) : (
          <Text style={styles.rankNumber}>#{entry.rank}</Text>
        )}
      </View>
      <AvatarDisplay avatarId={entry.avatar_id ?? null} size={28} />
      <View style={styles.info}>
        <Text style={[styles.name, isCurrentUser && styles.nameHighlighted]} numberOfLines={1}>
          {isCurrentUser ? t('leaderboardYou') : getPlayerName(entry.user_id, entry.display_name)}
        </Text>
        <Text style={styles.stats}>
          {t('leaderboardVotes', { count: entry.total_votes })}
        </Text>
      </View>
      <View style={styles.streakContainer}>
        <MaterialCommunityIcons name="fire" size={16} color={colors.warning} />
        <Text style={[styles.streakNumber, isCurrentUser && styles.nameHighlighted]}>
          {entry.current_streak}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      ...SHADOW.sm,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
    },
    highlighted: {
      borderWidth: 1,
      borderColor: colors.accent,
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
      color: colors.textMuted,
    },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    nameHighlighted: {
      color: colors.accent,
    },
    stats: {
      fontSize: 12,
      color: colors.textMuted,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    streakNumber: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.warning,
    },
  });
