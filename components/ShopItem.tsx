import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { t } from '../lib/i18n';
import { ThemeColors } from '../types/premium';

interface Props {
  emoji?: string;
  nameKey: string;
  descKey: string;
  isPremium: boolean;
  isOwned: boolean;
  isEquipped: boolean;
  userIsPremium: boolean;
  preview?: React.ReactNode;
  onEquip: () => void;
  onPurchase: () => void;
  onUpgrade: () => void;
}

export function ShopItem({
  emoji,
  nameKey,
  descKey,
  isPremium,
  isOwned,
  isEquipped,
  userIsPremium,
  preview,
  onEquip,
  onPurchase,
  onUpgrade,
}: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  const needsPremium = isPremium && !userIsPremium;

  const handlePress = () => {
    if (needsPremium) {
      onUpgrade();
    } else if (isOwned && !isEquipped) {
      onEquip();
    } else if (!isOwned) {
      onPurchase();
    }
  };

  const buttonLabel = isEquipped
    ? t('shopEquipped')
    : isOwned
    ? t('shopEquip')
    : needsPremium
    ? t('shopPremiumRequired')
    : t('shopGet');

  return (
    <View style={styles.container}>
      <View style={styles.previewArea}>
        {preview ?? (emoji ? <Text style={styles.emoji}>{emoji}</Text> : null)}
      </View>
      <Text style={styles.name}>{t(nameKey as any)}</Text>
      <Text style={styles.desc} numberOfLines={1}>{t(descKey as any)}</Text>
      <Pressable
        style={[
          styles.button,
          isEquipped && styles.buttonEquipped,
          needsPremium && styles.buttonLocked,
        ]}
        onPress={handlePress}
        disabled={isEquipped}
      >
        <Text style={[styles.buttonText, isEquipped && styles.buttonTextEquipped]}>
          {isEquipped ? '✓ ' : ''}{buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      gap: 6,
      minHeight: 140,
    },
    previewArea: {
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emoji: {
      fontSize: 32,
    },
    name: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    desc: {
      fontSize: 10,
      color: colors.textMuted,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginTop: 'auto',
    },
    buttonEquipped: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.accent,
    },
    buttonLocked: {
      backgroundColor: colors.textMuted,
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
    },
    buttonTextEquipped: {
      color: colors.accent,
    },
  });
