import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { LeaderboardEntry } from '../lib/leaderboard';
import { LeaderboardRow } from './LeaderboardRow';
import { t } from '../lib/i18n';

interface Props {
  entries: LeaderboardEntry[];
  userRank: number;
  userEntry: LeaderboardEntry | null;
  currentUserId: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export function LeaderboardList({ entries, userRank, userEntry, currentUserId, loading, onRefresh }: Props) {
  const isUserInList = entries.some((e) => e.user_id === currentUserId);

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <LeaderboardRow
            entry={item}
            isCurrentUser={item.user_id === currentUserId}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏆</Text>
              <Text style={styles.emptyText}>{t('leaderboardEmpty')}</Text>
              <Text style={styles.emptySubtext}>{t('leaderboardEmptyDesc')}</Text>
            </Animated.View>
          ) : null
        }
        ListFooterComponent={
          userEntry && !isUserInList && userRank > 0 ? (
            <View style={styles.userSection}>
              <Text style={styles.userSectionLabel}>···</Text>
              <LeaderboardRow entry={userEntry} isCurrentUser />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  userSection: {
    marginTop: 12,
    gap: 8,
    alignItems: 'center',
  },
  userSectionLabel: {
    fontSize: 18,
    color: Colors.textMuted,
    letterSpacing: 4,
  },
});
