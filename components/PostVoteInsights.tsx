import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { BadgeDef } from '../lib/badges';
import { getQuestionInsight } from '../lib/insights';
import { t } from '../lib/i18n';

interface Props {
  countA: number;
  countB: number;
  total: number;
  nextBadgeProgress?: { badge: BadgeDef; current: number; target: number } | null;
  isPremium?: boolean;
}

export function PostVoteInsights({ countA, countB, total, nextBadgeProgress, isPremium = true }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const insight = getQuestionInsight(countA, countB, total);

  // Free users see a teaser instead of full insights
  if (!isPremium) {
    if (!insight && !nextBadgeProgress) return null;
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.lockedRow}>
          <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
          <Text style={styles.lockedText}>{t('premiumFeature')}</Text>
        </Animated.View>
      </View>
    );
  }

  const hasContent = insight || nextBadgeProgress;
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      {/* Question insight */}
      {insight && (
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.insightRow}>
          <Text style={styles.insightEmoji}>{insight.emoji}</Text>
          <Text style={styles.insightText}>{t(insight.key)}</Text>
        </Animated.View>
      )}

      {/* Next badge progress */}
      {nextBadgeProgress && (
        <Animated.View entering={FadeIn.delay(1000).duration(400)} style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressEmoji}>{nextBadgeProgress.badge.emoji}</Text>
            <Text style={styles.progressLabel}>
              {t('nextBadgeProgress', {
                remaining: nextBadgeProgress.target - nextBadgeProgress.current,
                badge: t(nextBadgeProgress.badge.titleKey as any),
              })}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(nextBadgeProgress.current / nextBadgeProgress.target) * 100}%` },
              ]}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 12,
      paddingHorizontal: 24,
    },
    insightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    insightEmoji: {
      fontSize: 18,
    },
    insightText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
    },
    progressSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      gap: 8,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    progressEmoji: {
      fontSize: 18,
    },
    progressLabel: {
      fontSize: 13,
      color: colors.text,
      flex: 1,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.background,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 3,
    },
    lockedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 8,
    },
    lockEmoji: {
      fontSize: 16,
    },
    lockedText: {
      fontSize: 13,
      color: colors.textMuted,
    },
  });
