import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { getFrameById } from '../lib/cosmetics';
import { getPlayerName } from '../lib/leaderboard';
import { PersonalityType } from '../lib/personality';
import { PersonalityBadge } from './PersonalityBadge';
import { t } from '../lib/i18n';

interface Props {
  frameId: string;
  currentStreak: number;
  coins: number;
  userId: string;
  personality?: PersonalityType | null;
}

export function ProfileCard({ frameId, currentStreak, coins, userId, personality }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const frame = getFrameById(frameId);
  const hasFrame = frame.borderColors.length > 0;
  const playerName = userId ? getPlayerName(userId) : t('profileAnonymous');

  const AVATAR_SIZE = 80;
  const BORDER_WIDTH = 4;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
      {/* Avatar with frame */}
      <View style={styles.avatarSection}>
        {hasFrame ? (
          <View style={[styles.frameOuter, {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            backgroundColor: frame.borderColors[0],
          }]}>
            {/* Second color on bottom half */}
            <View style={[styles.frameHalf, {
              width: AVATAR_SIZE,
              height: AVATAR_SIZE / 2,
              bottom: 0,
              backgroundColor: frame.borderColors[1] ?? frame.borderColors[0],
              borderBottomLeftRadius: AVATAR_SIZE / 2,
              borderBottomRightRadius: AVATAR_SIZE / 2,
            }]} />
            {/* Inner circle */}
            <View style={[styles.avatarInner, {
              width: AVATAR_SIZE - BORDER_WIDTH * 2,
              height: AVATAR_SIZE - BORDER_WIDTH * 2,
              borderRadius: (AVATAR_SIZE - BORDER_WIDTH * 2) / 2,
              backgroundColor: colors.background,
            }]}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.avatarNoFrame, {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            borderColor: colors.textMuted,
            backgroundColor: colors.surface,
          }]}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        )}

        <Text style={styles.playerName}>{playerName}</Text>

        {/* Personality badge */}
        {personality && <PersonalityBadge personality={personality} />}

        {/* Streak + Coins row */}
        <View style={styles.infoRow}>
          {currentStreak > 0 && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>🔥 {currentStreak}</Text>
            </View>
          )}
          <View style={[styles.infoBadge, { borderColor: colors.warning }]}>
            <Text style={[styles.infoText, { color: colors.warning }]}>
              {coins} {t('coinSymbol')}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  frameOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frameHalf: {
    position: 'absolute',
  },
  avatarInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarNoFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarIcon: {
    fontSize: 32,
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
