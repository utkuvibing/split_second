import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { useUserStats } from '../../hooks/useUserStats';
import { useVoteHistory } from '../../hooks/useVoteHistory';
import { useBadges } from '../../hooks/useBadges';
import { StatsGrid } from '../../components/StatsGrid';
import { BadgeGrid } from '../../components/BadgeGrid';
import { HistoryCard } from '../../components/HistoryCard';
import { t } from '../../lib/i18n';

export default function ProfileScreen() {
  const { stats, loading: statsLoading } = useUserStats();
  const { history, loading: historyLoading } = useVoteHistory();
  const { unlockedBadges, loading: badgesLoading } = useBadges();

  const isLoading = statsLoading || historyLoading || badgesLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('statistics')}</Text>
              <StatsGrid stats={stats} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('badges')}</Text>
            <BadgeGrid unlockedBadges={unlockedBadges} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('pastVotes')} {history.length > 0 && `(${history.length})`}
            </Text>
            {history.length === 0 ? (
              <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🗳️</Text>
                <Text style={styles.emptyText}>{t('noVotesYet')}</Text>
                <Text style={styles.emptySubtext}>{t('castFirstVote')}</Text>
              </Animated.View>
            ) : (
              <View style={styles.historyList}>
                {history.map((item) => (
                  <HistoryCard key={item.question_id} item={item} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  historyList: {
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
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
  },
});
