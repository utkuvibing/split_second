import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { SHADOW, GLASS, RADIUS } from '../../constants/ui';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
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
import { usePersonality } from '../../hooks/usePersonality';
import { PersonalityProgress } from '../../components/PersonalityProgress';
import { PersonalityDetailCard } from '../../components/PersonalityDetailCard';
import { useFriends } from '../../hooks/useFriends';
import { FriendCodeCard } from '../../components/FriendCodeCard';
import { FriendsList } from '../../components/FriendsList';
import { AddFriendModal } from '../../components/AddFriendModal';
import { NicknameEditModal } from '../../components/NicknameEditModal';
import { AvatarPickerModal } from '../../components/AvatarPickerModal';
import { FriendRequestsList } from '../../components/FriendRequestsList';
import { PremiumFeaturesCard } from '../../components/PremiumFeaturesCard';
import { useFriendRequests } from '../../hooks/useFriendRequests';
import { t } from '../../lib/i18n';

export default function ProfileScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { isPremium, equippedFrame, friendCode, displayName, avatarId, loading: premiumLoading, refetch: refetchPremium } = usePremium();
  const { coins, loading: coinsLoading, fetchCoins } = useCoins();
  const { userId } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const { history, loading: historyLoading } = useVoteHistory(isPremium ? undefined : FREE_HISTORY_DAYS);
  const { unlockedBadges, loading: badgesLoading } = useBadges();

  const { personality, axes, totalVotes, isUnlocked: personalityUnlocked, loading: personalityLoading } = usePersonality();
  const { friends, addFriend, removeFriend: removeFriendById, loading: friendsLoading } = useFriends();
  const { requests: friendRequests, accept: acceptRequest, reject: rejectRequest, refetch: refetchRequests } = useFriendRequests();

  const [shopVisible, setShopVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [nicknameVisible, setNicknameVisible] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  const isLoading = statsLoading || historyLoading || badgesLoading || premiumLoading || coinsLoading || personalityLoading || friendsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
        <View style={styles.headerRight}>
          <GlassCard style={SHADOW.sm}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinText}>{coins} {t('coinSymbol')}</Text>
            </View>
          </GlassCard>
          <GradientButton title={t('shopTitle')} onPress={() => setShopVisible(true)} small />
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
            displayName={displayName}
            avatarId={avatarId}
            personality={personality}
            unlockedBadges={unlockedBadges}
            onEditNickname={() => setNicknameVisible(true)}
            onEditAvatar={() => setAvatarPickerVisible(true)}
          />

          {/* Premium features - free users only */}
          {!isPremium && (
            <PremiumFeaturesCard onUpgrade={() => setPaywallVisible(true)} />
          )}

          {/* Personality section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('personalityTitle')}</Text>
            {personalityUnlocked && personality && axes ? (
              <PersonalityDetailCard
                personality={personality}
                axes={axes}
                isPremium={isPremium}
              />
            ) : (
              <PersonalityProgress totalVotes={totalVotes} />
            )}
          </View>

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

          {/* Friends section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('friendsTitle')}
              {friendRequests.length > 0 ? ` (${friendRequests.length})` : ''}
            </Text>
            <FriendRequestsList
              requests={friendRequests}
              onAccept={async (id) => { await acceptRequest(id); refetchRequests(); }}
              onReject={async (id) => { await rejectRequest(id); refetchRequests(); }}
            />
            {friendCode ? <FriendCodeCard friendCode={friendCode} /> : null}
            <FriendsList
              friends={friends}
              isPremium={isPremium}
              onRemove={removeFriendById}
              onAddPress={() => setAddFriendVisible(true)}
            />
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
                <Ionicons name="checkbox-outline" size={40} color={colors.textMuted} />
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
              <DevMenu onPremiumChange={() => { refetchPremium(); fetchCoins(); }} />
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
      <AddFriendModal
        visible={addFriendVisible}
        onClose={() => setAddFriendVisible(false)}
        onSubmit={(code) => addFriend(code, isPremium)}
      />
      <NicknameEditModal
        visible={nicknameVisible}
        currentName={displayName}
        coins={coins}
        onClose={() => setNicknameVisible(false)}
        onSaved={() => { refetchPremium(); fetchCoins(); }}
      />
      <AvatarPickerModal
        visible={avatarPickerVisible}
        currentAvatarId={avatarId}
        isPremium={isPremium}
        coins={coins}
        onClose={() => setAvatarPickerVisible(false)}
        onSaved={() => { refetchPremium(); fetchCoins(); }}
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
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
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
    letterSpacing: 0.5,
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
