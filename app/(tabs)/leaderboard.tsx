import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { SHADOW, RADIUS, GLASS } from '../../constants/ui';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardList } from '../../components/Leaderboard';
import { t } from '../../lib/i18n';

type Tab = 'global' | 'friends';

export default function LeaderboardScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const { entries, userRank, userEntry, loading, refetch } = useLeaderboard(activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
      </View>
      <Text style={styles.title}>{t('leaderboardTitle')}</Text>

      {/* Tab toggle */}
      <GlassCard noBlur style={{ marginHorizontal: 16, marginBottom: 8 }}>
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, activeTab === 'global' && styles.tabActive]}
            onPress={() => setActiveTab('global')}
          >
            <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>
              {t('leaderboardGlobal')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
              {t('leaderboardFriends')}
            </Text>
          </Pressable>
        </View>
      </GlassCard>

      {loading && entries.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <>
          {activeTab === 'friends' && userRank > 0 && (
            <View style={styles.friendRankBanner}>
              <Text style={styles.friendRankText}>
                {t('leaderboardFriendRank', { rank: String(userRank) })}
              </Text>
            </View>
          )}
          <LeaderboardList
            entries={entries}
            userRank={userRank}
            userEntry={userEntry}
            currentUserId={userId}
            loading={loading}
            onRefresh={refetch}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendRankBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.accent + '20',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  friendRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
});
