import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  isPremiumOnly?: boolean;
  gradientAccent?: string;
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
  isPremiumOnly,
  gradientAccent,
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
    } else if (!isOwned && !isPremiumOnly && canAfford) {
      onPurchase();
    }
  };

  const buttonLabel = isEquipped
    ? t('shopEquipped')
    : isOwned
    ? t('shopEquip')
    : isPremiumOnly && !isOwned
    ? t('shopPremiumBadge')
    : `${price} ${t('coinSymbol')}`;

  const accent = gradientAccent ?? colors.accent;

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[accent + '18', colors.surface + 'E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { width }]}
      >
        <View style={styles.previewArea}>
          {preview ?? (emoji ? <Text style={styles.emoji}>{emoji}</Text> : null)}
        </View>
        <Text style={styles.name} numberOfLines={1}>{t(nameKey as any)}</Text>
        <Text style={styles.desc} numberOfLines={2}>{t(descKey as any)}</Text>
        <Pressable
          style={[
            styles.button,
            isEquipped && styles.buttonEquipped,
            isPremiumOnly && !isOwned && styles.buttonPremium,
            !isPremiumOnly && !isOwned && !canAfford && styles.buttonDisabled,
          ]}
          onPress={handleButtonPress}
          disabled={isEquipped || (isPremiumOnly && !isOwned) || (!isOwned && !canAfford)}
        >
          <Text style={[
            styles.buttonText,
            isEquipped && styles.buttonTextEquipped,
            isPremiumOnly && !isOwned && styles.buttonTextPremium,
            !isPremiumOnly && !isOwned && !canAfford && styles.buttonTextDisabled,
          ]}>
            {isEquipped ? '✓ ' : isPremiumOnly && !isOwned ? '⭐ ' : ''}{buttonLabel}
          </Text>
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors, itemWidth: number) =>
  StyleSheet.create({
    container: {
      width: itemWidth,
      borderRadius: 14,
      padding: 12,
      alignItems: 'center',
      gap: 6,
      minHeight: 170,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
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
    buttonPremium: {
      backgroundColor: colors.accent,
      opacity: 0.7,
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
    buttonTextPremium: {
      color: colors.text,
    },
    buttonTextDisabled: {
      color: colors.text,
      opacity: 0.7,
    },
  });
