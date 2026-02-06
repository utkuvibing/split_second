import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardList } from '../../components/Leaderboard';
import { t } from '../../lib/i18n';

export default function LeaderboardScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
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
          <ActivityIndicator size="large" color={colors.accent} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
