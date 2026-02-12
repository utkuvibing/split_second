import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { usePersonality } from '../../hooks/usePersonality';
import { useFriends } from '../../hooks/useFriends';
import { useCompatibility } from '../../hooks/useCompatibility';
import { CompatibilityCard } from '../../components/CompatibilityCard';
import { BestMatchBanner } from '../../components/BestMatchBanner';
import { GradientButton } from '../../components/ui/GradientButton';
import { t } from '../../lib/i18n';

export default function MatchingScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { axes, isUnlocked, loading: personalityLoading } = usePersonality();
  const { friends, loading: friendsLoading } = useFriends();
  const { friends: compatFriends, bestMatch, loading: compatLoading } = useCompatibility(axes);

  const isLoading = personalityLoading || friendsLoading || compatLoading;

  // Not yet unlocked personality
  if (!isLoading && !isUnlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>{t('matchingTitle')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
            <Ionicons name="heart-half-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('noPersonalityYet')}</Text>
            <Text style={styles.emptySubtext}>{t('noPersonalityMatchDesc')}</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // No friends
  if (!isLoading && friends.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>{t('matchingTitle')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('noFriendsYet')}</Text>
            <Text style={styles.emptySubtext}>{t('addFriendsToMatch')}</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('matchingTitle')}</Text>
      </View>
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Best match banner */}
          {bestMatch && <BestMatchBanner match={bestMatch} />}

          {/* All friends compatibility cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('friendsTitle')}</Text>
            <View style={styles.cardList}>
              {compatFriends.map((friend, index) => (
                <CompatibilityCard
                  key={friend.friend_id}
                  friend={friend}
                  index={index}
                />
              ))}
            </View>
          </View>
        </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 20,
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
  cardList: {
    gap: 12,
  },
});
