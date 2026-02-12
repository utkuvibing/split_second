import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  visible: boolean;
  optionA: string;
  optionB: string;
  countA: number;
  countB: number;
  timeRemaining: number;
  userChoice: string | null;
  coinsEarned: number;
  coinReward: number;
  onVote: (choice: 'a' | 'b') => void;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function LiveEventModal({
  visible, optionA, optionB, countA, countB,
  timeRemaining, userChoice, coinsEarned, coinReward,
  onVote, onClose,
}: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const total = countA + countB;
  const pctA = total > 0 ? Math.round((countA / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((countB / total) * 100) : 50;

  const pulseOpacity = useSharedValue(1);
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.4, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.liveTag}>
              <Animated.View style={[styles.liveDot, dotStyle]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>

          {/* Live counter */}
          <Animated.Text entering={FadeIn.duration(300)} style={styles.totalVotes}>
            {total} {t('votePlural')}
          </Animated.Text>

          {/* Options */}
          <View style={styles.options}>
            <Pressable
              style={[
                styles.optionCard,
                { backgroundColor: colors.optionA + '15', borderColor: colors.optionA },
                userChoice === 'a' && styles.optionSelected,
              ]}
              onPress={() => !userChoice && onVote('a')}
              disabled={!!userChoice}
            >
              <Text style={[styles.optionText, { color: colors.optionA }]}>
                {optionA}
              </Text>
              {userChoice && (
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: `${pctA}%`, backgroundColor: colors.optionA }]} />
                  <Text style={styles.pct}>{pctA}%</Text>
                </View>
              )}
              <Text style={[styles.count, { color: colors.optionA }]}>{countA}</Text>
            </Pressable>

            <Text style={styles.vs}>{t('communityVs')}</Text>

            <Pressable
              style={[
                styles.optionCard,
                { backgroundColor: colors.optionB + '15', borderColor: colors.optionB },
                userChoice === 'b' && styles.optionSelected,
              ]}
              onPress={() => !userChoice && onVote('b')}
              disabled={!!userChoice}
            >
              <Text style={[styles.optionText, { color: colors.optionB }]}>
                {optionB}
              </Text>
              {userChoice && (
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: `${pctB}%`, backgroundColor: colors.optionB }]} />
                  <Text style={styles.pct}>{pctB}%</Text>
                </View>
              )}
              <Text style={[styles.count, { color: colors.optionB }]}>{countB}</Text>
            </Pressable>
          </View>

          {/* Reward info */}
          {!userChoice && (
            <Text style={styles.rewardHint}>
              {t('liveEventReward', { coins: String(coinReward) })}
            </Text>
          )}

          {coinsEarned > 0 && (
            <Animated.Text entering={FadeIn.duration(400)} style={styles.earnedText}>
              +{coinsEarned} coins!
            </Animated.Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF000020',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF0000',
    letterSpacing: 2,
  },
  timer: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMuted,
    padding: 4,
  },
  totalVotes: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  optionCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    padding: 16,
    gap: 8,
  },
  optionSelected: {
    borderWidth: 3,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  pct: {
    position: 'absolute',
    right: 4,
    top: -14,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  vs: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 2,
  },
  rewardHint: {
    fontSize: 13,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: '600',
  },
  earnedText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.warning,
    textAlign: 'center',
  },
});
