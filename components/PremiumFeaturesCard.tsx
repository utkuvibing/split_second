import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { GradientButton } from './ui/GradientButton';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  onUpgrade: () => void;
}

const FEATURES: { icon: string; iconFamily?: 'mci'; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: 'document-text', titleKey: 'premiumFeatureHistory', descKey: 'premiumFeatureHistoryDesc' },
  { icon: 'bar-chart', titleKey: 'premiumFeatureStats', descKey: 'premiumFeatureStatsDesc' },
  { icon: 'medal', titleKey: 'premiumFeatureBadges', descKey: 'premiumFeatureBadgesDesc' },
  { icon: 'bulb', titleKey: 'premiumFeatureInsights', descKey: 'premiumFeatureInsightsDesc' },
  { icon: 'color-palette', titleKey: 'premiumFeatureThemes', descKey: 'premiumFeatureThemesDesc' },
  { icon: 'ban', titleKey: 'premiumFeatureNoAds', descKey: 'premiumFeatureNoAdsDesc' },
  { icon: 'people', titleKey: 'premiumFeatureFriends', descKey: 'premiumFeatureFriendsDesc' },
  { icon: 'brain', iconFamily: 'mci', titleKey: 'premiumFeaturePersonality', descKey: 'premiumFeaturePersonalityDesc' },
];

export function PremiumFeaturesCard({ onUpgrade }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
      <Text style={styles.header}>{t('premiumFeaturesTitle')}</Text>

      <View style={styles.featureList}>
        {FEATURES.map((f) => (
          <View key={f.titleKey} style={styles.featureRow}>
            <View style={styles.featureIconContainer}>
              {f.iconFamily === 'mci' ? (
                <MaterialCommunityIcons name={f.icon as any} size={20} color={colors.accent} />
              ) : (
                <Ionicons name={f.icon as any} size={20} color={colors.accent} />
              )}
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
              <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
            </View>
          </View>
        ))}
      </View>

      <GradientButton title={t('premiumUpgrade')} onPress={onUpgrade} glow />
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
