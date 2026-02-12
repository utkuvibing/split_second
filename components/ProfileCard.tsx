import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { getPlayerName } from '../lib/leaderboard';
import { PersonalityType } from '../lib/personality';
import { PersonalityBadge } from './PersonalityBadge';
import { AvatarDisplay } from './AvatarDisplay';
import { RADIUS, SHADOW, GLASS } from '../constants/ui';
import { UnlockedBadge, getBadgeById, getHardestBadges } from '../lib/badges';
import { t } from '../lib/i18n';

interface Props {
  frameId: string;
  currentStreak: number;
  coins: number;
  userId: string;
  displayName?: string | null;
  avatarId?: string | null;
  personality?: PersonalityType | null;
  unlockedBadges?: UnlockedBadge[];
  onEditNickname?: () => void;
  onEditAvatar?: () => void;
}

export function ProfileCard({ frameId, currentStreak, coins, userId, displayName, avatarId, personality, unlockedBadges, onEditNickname, onEditAvatar }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const playerName = userId ? getPlayerName(userId, displayName) : t('profileAnonymous');

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <LinearGradient
        colors={[colors.accent + '18', colors.surface + 'E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, SHADOW.md]}
      >
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <Pressable onPress={onEditAvatar}>
              <AvatarDisplay avatarId={avatarId ?? null} size={80} frameId={frameId} />
            </Pressable>

            <Pressable style={styles.nameRow} onPress={onEditNickname}>
              {onEditNickname && <View style={{ width: 20 }} />}
              <Text style={styles.playerName}>{playerName}</Text>
              {onEditNickname && (
                <Ionicons name="pencil" size={14} color={colors.textMuted} />
              )}
            </Pressable>

            {personality && <PersonalityBadge personality={personality} />}

            {unlockedBadges && unlockedBadges.length > 0 && (
              <BadgeShowcaseRow badges={unlockedBadges} colors={colors} />
            )}

            <View style={styles.infoRow}>
              {currentStreak > 0 && (
                <View style={styles.infoBadge}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="fire" size={16} color={colors.text} />
                    <Text style={styles.infoText}>{currentStreak}</Text>
                  </View>
                </View>
              )}
              <View style={[styles.infoBadge, { borderColor: colors.warning }]}>
                <Text style={[styles.infoText, { color: colors.warning }]}>
                  {coins} {t('coinSymbol')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function BadgeShowcaseRow({ badges }: { badges: UnlockedBadge[]; colors: ThemeColors }) {
  const hardest = getHardestBadges(badges, 3);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {hardest.map((ub) => {
        const badge = getBadgeById(ub.badge_id);
        if (!badge) return null;
        return (
          <Text key={ub.badge_id} style={{ fontSize: 22 }}>{badge.emoji}</Text>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  gradient: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: GLASS.borderColor,
  },
  card: {
    padding: 16,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoBadge: {
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
