import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme, useSetTheme } from '../lib/themeContext';
import { THEMES } from '../lib/themes';
import { FRAMES, VOTE_EFFECTS } from '../lib/cosmetics';
import { useCosmetics } from '../hooks/useCosmetics';
import { usePremium } from '../hooks/usePremium';
import { ShopItem } from './ShopItem';
import { ThemePreview } from './ThemePreview';
import { Paywall } from './Paywall';
import { t } from '../lib/i18n';
import { ThemeColors } from '../types/premium';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function Shop({ visible, onClose }: Props) {
  const colors = useTheme();
  const setTheme = useSetTheme();
  const styles = createStyles(colors);
  const { isPremium, equippedTheme, equippedFrame, equippedEffect, refetch: refetchPremium } = usePremium();
  const { isOwned, purchase, equip, refetch: refetchCosmetics } = useCosmetics();
  const [showPaywall, setShowPaywall] = useState(false);

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
    await purchase(cosmeticId);
    await refetchCosmetics();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('shopTitle')}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
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
                isPremium={theme.isPremium}
                isOwned={isOwned(theme.id)}
                isEquipped={equippedTheme === theme.id}
                userIsPremium={isPremium}
                preview={<ThemePreview themeColors={theme.colors} />}
                onEquip={() => handleEquipTheme(theme.id)}
                onPurchase={() => handlePurchase(theme.id)}
                onUpgrade={() => setShowPaywall(true)}
              />
            ))}
          </View>

          {/* Frames */}
          <Text style={styles.sectionTitle}>{t('shopFrames')}</Text>
          <View style={styles.grid}>
            {FRAMES.map((frame) => (
              <ShopItem
                key={frame.id}
                emoji={frame.borderColors.length > 0 ? '🖼️' : '◻️'}
                nameKey={frame.nameKey}
                descKey={frame.descKey}
                isPremium={frame.isPremium}
                isOwned={isOwned(frame.id)}
                isEquipped={equippedFrame === frame.id}
                userIsPremium={isPremium}
                onEquip={() => handleEquipFrame(frame.id)}
                onPurchase={() => handlePurchase(frame.id)}
                onUpgrade={() => setShowPaywall(true)}
              />
            ))}
          </View>

          {/* Vote Effects */}
          <Text style={styles.sectionTitle}>{t('shopEffects')}</Text>
          <View style={styles.grid}>
            {VOTE_EFFECTS.map((effect) => (
              <ShopItem
                key={effect.id}
                emoji={effect.emoji}
                nameKey={effect.nameKey}
                descKey={effect.descKey}
                isPremium={effect.isPremium}
                isOwned={isOwned(effect.id)}
                isEquipped={equippedEffect === effect.id}
                userIsPremium={isPremium}
                onEquip={() => handleEquipEffect(effect.id)}
                onPurchase={() => handlePurchase(effect.id)}
                onUpgrade={() => setShowPaywall(true)}
              />
            ))}
          </View>
        </ScrollView>

        <Paywall
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          onPurchased={refetchPremium}
        />
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
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    closeText: {
      fontSize: 20,
      color: colors.textMuted,
      padding: 4,
    },
    content: {
      paddingHorizontal: 16,
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
      gap: 10,
    },
  });
