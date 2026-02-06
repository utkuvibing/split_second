import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardList } from '../../components/Leaderboard';
import { t } from '../../lib/i18n';

export default function LeaderboardScreen() {
  const { userId } = useAuth();
  const { entries, userRank, userEntry, loading, refetch } = useLeaderboard();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
      </View>
      <Text style={styles.title}>{t('leaderboardTitle')}</Text>
      {loading && entries.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <LeaderboardList
          entries={entries}
          userRank={userRank}
          userEntry={userEntry}
          currentUserId={userId}
          loading={loading}
          onRefresh={refetch}
        />
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
