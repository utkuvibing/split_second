import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  onUpgrade: () => void;
}

const FEATURES: { emoji: string; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { emoji: '📜', titleKey: 'premiumFeatureHistory', descKey: 'premiumFeatureHistoryDesc' },
  { emoji: '📊', titleKey: 'premiumFeatureStats', descKey: 'premiumFeatureStatsDesc' },
  { emoji: '🏅', titleKey: 'premiumFeatureBadges', descKey: 'premiumFeatureBadgesDesc' },
  { emoji: '💡', titleKey: 'premiumFeatureInsights', descKey: 'premiumFeatureInsightsDesc' },
  { emoji: '🎨', titleKey: 'premiumFeatureThemes', descKey: 'premiumFeatureThemesDesc' },
  { emoji: '🚫', titleKey: 'premiumFeatureNoAds', descKey: 'premiumFeatureNoAdsDesc' },
  { emoji: '👥', titleKey: 'premiumFeatureFriends', descKey: 'premiumFeatureFriendsDesc' },
  { emoji: '🧠', titleKey: 'premiumFeaturePersonality', descKey: 'premiumFeaturePersonalityDesc' },
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
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
              <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={[styles.ctaButton, { backgroundColor: colors.accent }]} onPress={onUpgrade}>
        <Text style={styles.ctaText}>{t('premiumUpgrade')}</Text>
      </Pressable>
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
  featureEmoji: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
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
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
