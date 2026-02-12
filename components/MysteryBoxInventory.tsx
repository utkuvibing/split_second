import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { MysteryBox, RARITY_COLORS, RARITY_EMOJIS } from '../lib/mysteryBox';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';

interface Props {
  boxes: MysteryBox[];
  onOpenBox: (boxId: string) => void;
}

export function MysteryBoxInventory({ boxes, onOpenBox }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (boxes.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.title}>{t('mysteryBoxInventory')} ({boxes.length})</Text>
      <View style={styles.grid}>
        {boxes.map((box, i) => {
          const rarityColor = RARITY_COLORS[box.rarity];
          return (
            <Pressable
              key={box.id}
              style={[styles.boxCard, { borderColor: rarityColor }]}
              onPress={() => onOpenBox(box.id)}
            >
              <Text style={styles.boxEmoji}>{RARITY_EMOJIS[box.rarity]}</Text>
              <Text style={[styles.boxRarity, { color: rarityColor }]}>
                {t(`rarity_${box.rarity}` as any)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  boxCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOW.sm,
  },
  boxEmoji: {
    fontSize: 28,
  },
  boxRarity: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
