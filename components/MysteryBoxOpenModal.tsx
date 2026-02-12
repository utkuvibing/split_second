import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { BoxRarity, RewardType, RARITY_COLORS, RARITY_EMOJIS } from '../lib/mysteryBox';
import { t } from '../lib/i18n';
import { RADIUS } from '../constants/ui';

interface Props {
  visible: boolean;
  rarity: BoxRarity | null;
  rewardType: RewardType | null;
  rewardValue: string | null;
  onClose: () => void;
}

const REWARD_EMOJIS: Record<RewardType, string> = {
  coins: '🪙',
  cosmetic: '✨',
  boost: '⚡',
};

export function MysteryBoxOpenModal({ visible, rarity, rewardType, rewardValue, onClose }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [phase, setPhase] = useState<'shake' | 'reveal'>('shake');

  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      setPhase('shake');
      // Shake animation
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );

      // After shake, explode and reveal
      scale.value = withDelay(400, withSequence(
        withSpring(1.3, { damping: 5, stiffness: 200 }),
        withTiming(0, { duration: 200 }),
      ));
      opacity.value = withDelay(700, withTiming(0, { duration: 100 }));

      const timer = setTimeout(() => setPhase('reveal'), 800);
      return () => clearTimeout(timer);
    } else {
      shakeX.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }
  }, [visible]);

  const boxAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!rarity || !rewardType || !rewardValue) return null;

  const rarityColor = RARITY_COLORS[rarity];

  const getRewardLabel = () => {
    if (rewardType === 'coins') return `+${rewardValue} coins`;
    if (rewardType === 'boost') return t('mysteryBoxBoost');
    return t(`cosmetic_${rewardValue}` as any) || rewardValue;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {phase === 'shake' && (
            <Animated.View style={[styles.boxContainer, boxAnimStyle]}>
              <Text style={styles.bigEmoji}>{RARITY_EMOJIS[rarity]}</Text>
            </Animated.View>
          )}

          {phase === 'reveal' && (
            <Animated.View
              entering={FadeIn.duration(400)}
              style={styles.revealContainer}
            >
              <Text style={styles.rewardEmoji}>{REWARD_EMOJIS[rewardType]}</Text>
              <Text style={[styles.rarityLabel, { color: rarityColor }]}>
                {t(`rarity_${rarity}` as any)}
              </Text>
              <Text style={styles.rewardLabel}>{getRewardLabel()}</Text>

              <Pressable style={[styles.closeBtn, { backgroundColor: rarityColor }]} onPress={onClose}>
                <Text style={styles.closeBtnText}>{t('continue')}</Text>
              </Pressable>
            </Animated.View>
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
    width: '85%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: 32,
    alignItems: 'center',
    minHeight: 280,
    justifyContent: 'center',
  },
  boxContainer: {
    alignItems: 'center',
  },
  bigEmoji: {
    fontSize: 72,
  },
  revealContainer: {
    alignItems: 'center',
    gap: 12,
  },
  rewardEmoji: {
    fontSize: 56,
  },
  rarityLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  rewardLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  closeBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    marginTop: 16,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
