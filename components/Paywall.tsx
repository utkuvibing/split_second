import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { setDevPremium } from '../lib/premium';
import { t } from '../lib/i18n';
import { ThemeColors } from '../types/premium';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased?: () => void;
}

const FEATURES = [
  'premiumFeatureHistory',
  'premiumFeatureStats',
  'premiumFeatureBadges',
  'premiumFeatureInsights',
  'premiumFeatureThemes',
  'premiumFeatureNoAds',
] as const;

export function Paywall({ visible, onClose, onPurchased }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handlePurchase = async () => {
    // Phase 1: Dev stub — toggle premium in AsyncStorage
    await setDevPremium(true);
    onPurchased?.();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Animated.View entering={SlideInDown.duration(400)} style={styles.container}>
          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Header */}
          <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.header}>
            <Text style={styles.logo}>⚡</Text>
            <Text style={styles.title}>{t('premiumTitle')}</Text>
            <Text style={styles.subtitle}>{t('premiumSubtitle')}</Text>
          </Animated.View>

          {/* Feature list */}
          <View style={styles.featureList}>
            {FEATURES.map((key) => (
              <View key={key} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{t(key)}</Text>
              </View>
            ))}
          </View>

          {/* Plan selection */}
          <View style={styles.plans}>
            <Pressable
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planSelected]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <Text style={styles.planTitle}>{t('premiumMonthly')}</Text>
              <Text style={styles.planPrice}>{t('premiumMonthlyPrice')}</Text>
            </Pressable>
            <Pressable
              style={[styles.planCard, selectedPlan === 'yearly' && styles.planSelected]}
              onPress={() => setSelectedPlan('yearly')}
            >
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>{t('premiumYearlySave')}</Text>
              </View>
              <Text style={styles.planTitle}>{t('premiumYearly')}</Text>
              <Text style={styles.planPrice}>{t('premiumYearlyPrice')}</Text>
            </Pressable>
          </View>

          {/* CTA */}
          <Pressable style={styles.ctaButton} onPress={handlePurchase}>
            <Text style={styles.ctaText}>{t('premiumStartTrial')}</Text>
          </Pressable>

          {/* Restore */}
          <Pressable onPress={handlePurchase}>
            <Text style={styles.restoreText}>{t('premiumRestore')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 48,
      gap: 20,
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    closeText: {
      fontSize: 16,
      color: colors.textMuted,
    },
    header: {
      alignItems: 'center',
      gap: 8,
      paddingTop: 8,
    },
    logo: {
      fontSize: 48,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: 'center',
    },
    featureList: {
      gap: 10,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    featureCheck: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.accent,
    },
    featureText: {
      fontSize: 15,
      color: colors.text,
    },
    plans: {
      flexDirection: 'row',
      gap: 12,
    },
    planCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      gap: 4,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    planSelected: {
      borderColor: colors.accent,
    },
    planTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
    },
    planPrice: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    saveBadge: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginBottom: 4,
    },
    saveText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.text,
    },
    ctaButton: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
    },
    ctaText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    restoreText: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
