import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { getPlayerName } from '../lib/leaderboard';
import { PersonalityType } from '../lib/personality';
import { PersonalityBadge } from './PersonalityBadge';
import { AvatarDisplay } from './AvatarDisplay';
import { RADIUS } from '../constants/ui';
import { GlassCard } from './ui/GlassCard';
import { t } from '../lib/i18n';

interface Props {
  frameId: string;
  currentStreak: number;
  coins: number;
  userId: string;
  displayName?: string | null;
  avatarId?: string | null;
  personality?: PersonalityType | null;
  onEditNickname?: () => void;
  onEditAvatar?: () => void;
}

export function ProfileCard({ frameId, currentStreak, coins, userId, displayName, avatarId, personality, onEditNickname, onEditAvatar }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const playerName = userId ? getPlayerName(userId, displayName) : t('profileAnonymous');

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <GlassCard>
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <Pressable onPress={onEditAvatar}>
              <AvatarDisplay avatarId={avatarId ?? null} size={80} frameId={frameId} />
            </Pressable>

            <Pressable style={styles.nameRow} onPress={onEditNickname}>
              <Text style={styles.playerName}>{playerName}</Text>
              {onEditNickname && (
                <Ionicons name="pencil" size={14} color={colors.textMuted} />
              )}
            </Pressable>

            {personality && <PersonalityBadge personality={personality} />}

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
      </GlassCard>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
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
