import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSetTheme } from '../lib/themeContext';
import { THEMES } from '../lib/themes';
import { FRAMES, VOTE_EFFECTS } from '../lib/cosmetics';
import { useCosmetics } from '../hooks/useCosmetics';
import { usePremium } from '../hooks/usePremium';
import { useCoins } from '../hooks/useCoins';
import { ShopItem } from './ShopItem';
import { ThemePreview } from './ThemePreview';
import { FramePreview } from './FramePreview';
import { EffectPreview } from './EffectPreview';
import { ItemPreviewModal } from './ItemPreviewModal';
import { t } from '../lib/i18n';
import { getCoinPrice } from '../lib/coins';
import { ThemeColors, FrameDef, VoteEffectDef, ThemeDef } from '../types/premium';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const GRID_GAP = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

type PreviewItem = {
  type: 'theme';
  item: ThemeDef;
} | {
  type: 'frame';
  item: FrameDef;
} | {
  type: 'effect';
  item: VoteEffectDef;
};

interface Props {
  visible: boolean;
  onClose: () => void;
}

function isPremiumOnlyItem(item: { id: string; isPremium?: boolean }): boolean {
  return !!item.isPremium && getCoinPrice(item.id) === 0 && item.id !== 'default' && item.id !== 'none';
}

export function Shop({ visible, onClose }: Props) {
  const colors = useTheme();
  const setTheme = useSetTheme();
  const styles = createStyles(colors);
  const { equippedTheme, equippedFrame, equippedEffect, isPremium, refetch: refetchPremium } = usePremium();
  const { isOwned, purchase, equip, refetch: refetchCosmetics } = useCosmetics();
  const { coins, fetchCoins } = useCoins();
  const [previewItem, setPreviewItem] = useState<PreviewItem | null>(null);

  const handleEquipTheme = async (themeId: string) => {
    const success = await equip('theme', themeId);
    if (success) {
      setTheme(themeId);
      await refetchPremium();
    }
  };

  const handleEquipFrame = async (frameId: string) => {
    const success = await equip('frame', frameId);
    if (success) await refetchPremium();
  };

  const handleEquipEffect = async (effectId: string) => {
    const success = await equip('vote_effect', effectId);
    if (success) await refetchPremium();
  };

  const handlePurchase = async (cosmeticId: string) => {
    const price = getCoinPrice(cosmeticId);
    if (price === 0) return;
    if (coins < price) {
      Alert.alert(t('shopInsufficientCoins'), t('shopInsufficientCoinsDesc'));
      return;
    }
    const result = await purchase(cosmeticId, price);
    if (result.success) {
      await Promise.all([refetchCosmetics(), fetchCoins()]);
      setPreviewItem(null);
    } else if (result.error === 'insufficient_coins') {
      Alert.alert(t('shopInsufficientCoins'), t('shopInsufficientCoinsDesc'));
    }
  };

  const getPreviewEquipped = () => {
    if (!previewItem) return false;
    if (previewItem.type === 'theme') return equippedTheme === previewItem.item.id;
    if (previewItem.type === 'frame') return equippedFrame === previewItem.item.id;
    return equippedEffect === previewItem.item.id;
  };

  const handlePreviewEquip = async () => {
    if (!previewItem) return;
    if (previewItem.type === 'theme') await handleEquipTheme(previewItem.item.id);
    else if (previewItem.type === 'frame') await handleEquipFrame(previewItem.item.id);
    else await handleEquipEffect(previewItem.item.id);
    setPreviewItem(null);
  };

  const handlePreviewPurchase = async () => {
    if (!previewItem) return;
    await handlePurchase(previewItem.item.id);
  };

  const isEffectivelyOwned = (id: string, item: { isPremium?: boolean }) => {
    return isOwned(id) || (isPremiumOnlyItem(item as any) && isPremium);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('shopTitle')}</Text>
          <View style={styles.headerRight}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinText}>{coins} {t('coinSymbol')}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Themes */}
          <Text style={styles.sectionTitle}>{t('shopThemes')}</Text>
          <View style={styles.grid}>
            {THEMES.map((theme) => (
              <ShopItem
                key={theme.id}
                nameKey={theme.nameKey}
                descKey={theme.nameKey}
                price={getCoinPrice(theme.id)}
                isOwned={isEffectivelyOwned(theme.id, theme)}
                isEquipped={equippedTheme === theme.id}
                userCoins={coins}
                preview={<ThemePreview themeColors={theme.colors} />}
                width={ITEM_WIDTH}
                isPremiumOnly={isPremiumOnlyItem(theme) && !isPremium}
                gradientAccent={theme.colors.accent}
                onPress={() => setPreviewItem({ type: 'theme', item: theme })}
                onEquip={() => handleEquipTheme(theme.id)}
                onPurchase={() => handlePurchase(theme.id)}
              />
            ))}
          </View>

          {/* Frames */}
          <Text style={styles.sectionTitle}>{t('shopFrames')}</Text>
          <View style={styles.grid}>
            {FRAMES.map((frame) => (
              <ShopItem
                key={frame.id}
                nameKey={frame.nameKey}
                descKey={frame.descKey}
                price={getCoinPrice(frame.id)}
                isOwned={isEffectivelyOwned(frame.id, frame)}
                isEquipped={equippedFrame === frame.id}
                userCoins={coins}
                preview={<FramePreview borderColors={frame.borderColors} size={48} />}
                width={ITEM_WIDTH}
                isPremiumOnly={isPremiumOnlyItem(frame) && !isPremium}
                onPress={() => setPreviewItem({ type: 'frame', item: frame })}
                onEquip={() => handleEquipFrame(frame.id)}
                onPurchase={() => handlePurchase(frame.id)}
              />
            ))}
          </View>

          {/* Vote Effects */}
          <Text style={styles.sectionTitle}>{t('shopEffects')}</Text>
          <View style={styles.grid}>
            {VOTE_EFFECTS.map((effect) => (
              <ShopItem
                key={effect.id}
                nameKey={effect.nameKey}
                descKey={effect.descKey}
                price={getCoinPrice(effect.id)}
                isOwned={isEffectivelyOwned(effect.id, effect)}
                isEquipped={equippedEffect === effect.id}
                userCoins={coins}
                emoji={effect.emoji}
                width={ITEM_WIDTH}
                isPremiumOnly={isPremiumOnlyItem(effect) && !isPremium}
                onPress={() => setPreviewItem({ type: 'effect', item: effect })}
                onEquip={() => handleEquipEffect(effect.id)}
                onPurchase={() => handlePurchase(effect.id)}
              />
            ))}
          </View>
        </ScrollView>

        {previewItem && (
          <ItemPreviewModal
            visible={!!previewItem}
            item={previewItem}
            isOwned={isEffectivelyOwned(previewItem.item.id, previewItem.item)}
            isEquipped={getPreviewEquipped()}
            price={getCoinPrice(previewItem.item.id)}
            userCoins={coins}
            isPremiumOnly={isPremiumOnlyItem(previewItem.item) && !isPremium}
            onClose={() => setPreviewItem(null)}
            onEquip={handlePreviewEquip}
            onPurchase={handlePreviewPurchase}
          />
        )}
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    coinBadge: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: colors.warning,
    },
    coinText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.warning,
    },
    closeText: {
      fontSize: 20,
      color: colors.textMuted,
      padding: 4,
    },
    content: {
      paddingHorizontal: GRID_PADDING,
      paddingBottom: 48,
      gap: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginTop: 8,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GRID_GAP,
    },
  });
