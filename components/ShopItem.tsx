import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { t } from '../lib/i18n';
import { ThemeColors } from '../types/premium';

interface Props {
  nameKey: string;
  descKey: string;
  price: number;
  isOwned: boolean;
  isEquipped: boolean;
  userCoins: number;
  preview?: React.ReactNode;
  emoji?: string;
  width: number;
  onPress: () => void;
  onEquip: () => void;
  onPurchase: () => void;
}

export function ShopItem({
  nameKey,
  descKey,
  price,
  isOwned,
  isEquipped,
  userCoins,
  preview,
  emoji,
  width,
  onPress,
  onEquip,
  onPurchase,
}: Props) {
  const colors = useTheme();
  const styles = createStyles(colors, width);
  const canAfford = userCoins >= price;

  const handleButtonPress = () => {
    if (isOwned && !isEquipped) {
      onEquip();
    } else if (!isOwned && canAfford) {
      onPurchase();
    }
  };

  const buttonLabel = isEquipped
    ? t('shopEquipped')
    : isOwned
    ? t('shopEquip')
    : `${price} ${t('coinSymbol')}`;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.previewArea}>
        {preview ?? (emoji ? <Text style={styles.emoji}>{emoji}</Text> : null)}
      </View>
      <Text style={styles.name} numberOfLines={1}>{t(nameKey as any)}</Text>
      <Text style={styles.desc} numberOfLines={2}>{t(descKey as any)}</Text>
      <Pressable
        style={[
          styles.button,
          isEquipped && styles.buttonEquipped,
          !isOwned && !canAfford && styles.buttonDisabled,
        ]}
        onPress={handleButtonPress}
        disabled={isEquipped || (!isOwned && !canAfford)}
      >
        <Text style={[
          styles.buttonText,
          isEquipped && styles.buttonTextEquipped,
          !isOwned && !canAfford && styles.buttonTextDisabled,
        ]}>
          {isEquipped ? '✓ ' : ''}{buttonLabel}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors, itemWidth: number) =>
  StyleSheet.create({
    container: {
      width: itemWidth,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      alignItems: 'center',
      gap: 6,
      minHeight: 170,
    },
    previewArea: {
      height: 64,
      width: 64,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emoji: {
      fontSize: 36,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    desc: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 15,
    },
    button: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 7,
      paddingHorizontal: 14,
      marginTop: 'auto',
    },
    buttonEquipped: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.accent,
    },
    buttonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.4,
    },
    buttonText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    buttonTextEquipped: {
      color: colors.accent,
    },
    buttonTextDisabled: {
      color: colors.text,
      opacity: 0.7,
    },
  });
