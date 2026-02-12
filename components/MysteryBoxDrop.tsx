import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { BounceIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { BoxRarity, RARITY_COLORS, RARITY_EMOJIS } from '../lib/mysteryBox';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  rarity: BoxRarity;
  onOpen: () => void;
  onDismiss: () => void;
}

export function MysteryBoxDrop({ rarity, onOpen, onDismiss }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const rarityColor = RARITY_COLORS[rarity];

  return (
    <Pressable style={styles.overlay} onPress={onDismiss}>
      <Animated.View
        entering={BounceIn.duration(600)}
        exiting={FadeOut.duration(200)}
        style={styles.container}
      >
        <View style={[styles.boxIcon, { borderColor: rarityColor }]}>
          <Text style={styles.emoji}>{RARITY_EMOJIS[rarity]}</Text>
        </View>
        <Text style={styles.title}>{t('mysteryBoxDropped')}</Text>
        <Text style={[styles.rarity, { color: rarityColor }]}>
          {t(`rarity_${rarity}` as any)}
        </Text>
        <Pressable style={[styles.openButton, { backgroundColor: rarityColor }]} onPress={onOpen}>
          <Text style={styles.openText}>{t('mysteryBoxOpen')}</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    width: '80%',
    maxWidth: 300,
    ...SHADOW.lg,
  },
  boxIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  rarity: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  openButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    marginTop: 8,
  },
  openText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
