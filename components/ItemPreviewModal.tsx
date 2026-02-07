import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { ThemePreview } from './ThemePreview';
import { FramePreview } from './FramePreview';
import { EffectPreview } from './EffectPreview';
import { t } from '../lib/i18n';
import { ThemeColors, ThemeDef, FrameDef, VoteEffectDef } from '../types/premium';

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
  item: PreviewItem;
  isOwned: boolean;
  isEquipped: boolean;
  price: number;
  userCoins: number;
  onClose: () => void;
  onEquip: () => void;
  onPurchase: () => void;
}

function ThemeLargePreview({ theme }: { theme: ThemeDef }) {
  const c = theme.colors;
  return (
    <View style={[previewStyles.themeCard, { backgroundColor: c.background }]}>
      <View style={[previewStyles.themeQuestion, { backgroundColor: c.surface }]}>
        <Text style={[previewStyles.themeQuestionText, { color: c.text }]}>
          {t('shopPreviewQuestion')}
        </Text>
      </View>
      <View style={previewStyles.themeOptions}>
        <View style={[previewStyles.themeOption, { backgroundColor: c.optionA }]}>
          <Text style={previewStyles.themeOptionText}>{t('shopPreviewOptionA')}</Text>
        </View>
        <View style={[previewStyles.themeOption, { backgroundColor: c.optionB }]}>
          <Text style={previewStyles.themeOptionText}>{t('shopPreviewOptionB')}</Text>
        </View>
      </View>
      <View style={[previewStyles.themeAccentBar, { backgroundColor: c.accent }]} />
    </View>
  );
}

export function ItemPreviewModal({
  visible,
  item,
  isOwned,
  isEquipped,
  price,
  userCoins,
  onClose,
  onEquip,
  onPurchase,
}: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const canAfford = userCoins >= price;
  const isFree = price === 0;

  const nameKey = item.item.nameKey;
  const descKey = item.type === 'theme' ? item.item.nameKey : (item.item as FrameDef | VoteEffectDef).descKey;

  const renderPreview = () => {
    switch (item.type) {
      case 'theme':
        return <ThemeLargePreview theme={item.item} />;
      case 'frame':
        return <FramePreview borderColors={item.item.borderColors} size={120} />;
      case 'effect':
        return <EffectPreview effectId={item.item.id} size={140} />;
    }
  };

  const renderButton = () => {
    if (isEquipped) {
      return (
        <View style={[styles.actionButton, styles.actionButtonEquipped]}>
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            ✓ {t('shopEquipped')}
          </Text>
        </View>
      );
    }
    if (isOwned) {
      return (
        <Pressable style={styles.actionButton} onPress={onEquip}>
          <Text style={styles.actionButtonText}>{t('shopEquip')}</Text>
        </Pressable>
      );
    }
    if (isFree) {
      return null;
    }
    return (
      <Pressable
        style={[styles.actionButton, !canAfford && styles.actionButtonDisabled]}
        onPress={onPurchase}
        disabled={!canAfford}
      >
        <Text style={[styles.actionButtonText, !canAfford && { opacity: 0.5 }]}>
          {canAfford ? t('shopBuyFor', { price: String(price) }) : t('shopInsufficientCoins')}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <View style={styles.previewArea}>
            {renderPreview()}
          </View>

          <Text style={styles.itemName}>{t(nameKey as any)}</Text>
          <Text style={styles.itemDesc}>{t(descKey as any)}</Text>

          {!isFree && !isOwned && (
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{price} {t('coinSymbol')}</Text>
              <Text style={styles.balanceText}>
                {t('shopYourBalance')}: {userCoins} {t('coinSymbol')}
              </Text>
            </View>
          )}

          {renderButton()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const previewStyles = StyleSheet.create({
  themeCard: {
    width: 220,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  themeQuestion: {
    width: '100%',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  themeQuestionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  themeOption: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  themeAccentBar: {
    width: '60%',
    height: 4,
    borderRadius: 2,
  },
});

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: '85%',
      maxWidth: 340,
      alignItems: 'center',
      gap: 12,
    },
    closeButton: {
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 1,
    },
    closeText: {
      fontSize: 18,
      color: colors.textMuted,
    },
    previewArea: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 140,
    },
    itemName: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    itemDesc: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    priceRow: {
      alignItems: 'center',
      gap: 4,
      paddingTop: 4,
    },
    priceText: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.warning,
    },
    balanceText: {
      fontSize: 12,
      color: colors.textMuted,
    },
    actionButton: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 32,
      marginTop: 4,
      width: '100%',
      alignItems: 'center',
    },
    actionButtonEquipped: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.accent,
    },
    actionButtonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.5,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
  });
