import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { useUserStats } from '../../hooks/useUserStats';
import { useVoteHistory } from '../../hooks/useVoteHistory';
import { useBadges } from '../../hooks/useBadges';
import { usePremium } from '../../hooks/usePremium';
import { useCoins } from '../../hooks/useCoins';
import { useAuth } from '../../hooks/useAuth';
import { FREE_HISTORY_DAYS } from '../../lib/premium';
import { StatsGrid } from '../../components/StatsGrid';
import { BadgeGrid } from '../../components/BadgeGrid';
import { HistoryCard } from '../../components/HistoryCard';
import { PremiumGate } from '../../components/PremiumGate';
import { ProfileCard } from '../../components/ProfileCard';
import { Shop } from '../../components/Shop';
import { Paywall } from '../../components/Paywall';
import { DevMenu } from '../../components/DevMenu';
import { t } from '../../lib/i18n';

export default function ProfileScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { isPremium, equippedFrame, loading: premiumLoading, refetch: refetchPremium } = usePremium();
  const { coins, loading: coinsLoading } = useCoins();
  const { userId } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const { history, loading: historyLoading } = useVoteHistory(isPremium ? undefined : FREE_HISTORY_DAYS);
  const { unlockedBadges, loading: badgesLoading } = useBadges();

  const [shopVisible, setShopVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const isLoading = statsLoading || historyLoading || badgesLoading || premiumLoading || coinsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
        <View style={styles.headerRight}>
          <View style={styles.coinBadge}>
            <Text style={styles.coinText}>{coins} {t('coinSymbol')}</Text>
          </View>
          <Pressable style={[styles.shopButton, { backgroundColor: colors.accent }]} onPress={() => setShopVisible(true)}>
            <Text style={styles.shopButtonText}>{t('shopTitle')}</Text>
          </Pressable>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile card with avatar + frame */}
          <ProfileCard
            frameId={equippedFrame}
            currentStreak={stats?.current_streak ?? 0}
            coins={coins}
            userId={userId ?? ''}
          />

          {/* Stats - gated for detailed view */}
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('statistics')}</Text>
              <PremiumGate
                isPremium={isPremium}
                feature="detailedStats"
                onUpgrade={() => setPaywallVisible(true)}
              >
                <StatsGrid stats={stats} />
              </PremiumGate>
            </View>
          )}

          {/* Badges - premium badges filtered inside BadgeGrid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('badges')}</Text>
            <BadgeGrid unlockedBadges={unlockedBadges} userIsPremium={isPremium} />
          </View>

          {/* Vote history - limited to 7 days for free users */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('pastVotes')} {history.length > 0 && `(${history.length})`}
            </Text>
            {!isPremium && history.length > 0 && (
              <Pressable style={styles.historyLimitBanner} onPress={() => setPaywallVisible(true)}>
                <Text style={styles.historyLimitText}>{t('premiumHistoryLimit')}</Text>
                <Text style={[styles.historyLimitCta, { color: colors.accent }]}>{t('premiumSeeAll')}</Text>
              </Pressable>
            )}
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

          {/* Dev menu - only in development */}
          {__DEV__ && (
            <View style={styles.section}>
              <DevMenu onPremiumChange={refetchPremium} />
            </View>
          )}
        </ScrollView>
      )}

      <Shop visible={shopVisible} onClose={() => { setShopVisible(false); refetchPremium(); }} />
      <Paywall
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onPurchased={refetchPremium}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinBadge: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  coinText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
  },
  shopButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  shopButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
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
    color: colors.text,
  },
  historyLimitBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  historyLimitText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  historyLimitCta: {
    fontSize: 13,
    fontWeight: '700',
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
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
