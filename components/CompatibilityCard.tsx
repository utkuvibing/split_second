import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { FriendCompatibility } from '../hooks/useCompatibility';
import { getCompatibilityLabelKey } from '../lib/compatibility';
import { AvatarDisplay } from './AvatarDisplay';
import { GlassCard } from './ui/GlassCard';
import { t, TranslationKey } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';
import { getFriendDisplayName } from '../lib/friends';

interface Props {
  friend: FriendCompatibility;
  index: number;
}

function AxisSimilarityBar({ label, value, color }: {
  label: string;
  value: number;
  color: string;
}) {
  const colors = useTheme();
  const barStyles = createBarStyles(colors);

  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.barBg}>
        <View style={[barStyles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[barStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

export function CompatibilityCard({ friend, index }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  const name = getFriendDisplayName(friend.friend_code, friend.friend_display_name);
  const compat = friend.compatibility;

  if (!compat) {
    // Friend has no personality yet
    return (
      <Animated.View entering={FadeIn.delay(index * 100).duration(300)}>
        <GlassCard style={SHADOW.sm}>
          <View style={styles.card}>
            <View style={styles.header}>
              <AvatarDisplay avatarId={friend.friend_avatar_id ?? null} size={40} />
              <View style={styles.headerText}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.noPersonality}>{t('friendNoPersonality')}</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    );
  }

  const labelKey = getCompatibilityLabelKey(compat.label);

  return (
    <Animated.View entering={FadeIn.delay(index * 100).duration(300)}>
      <GlassCard style={SHADOW.sm}>
        <View style={styles.card}>
          {/* Header: avatar + name + score */}
          <View style={styles.header}>
            <AvatarDisplay avatarId={friend.friend_avatar_id ?? null} size={40} />
            <View style={styles.headerText}>
              <Text style={styles.name}>{name}</Text>
              <Text style={[styles.label, { color: getScoreColor(compat.overallScore, colors) }]}>
                {t(labelKey as TranslationKey)}
              </Text>
            </View>
            <View style={[styles.scoreBadge, { borderColor: getScoreColor(compat.overallScore, colors) }]}>
              <Text style={[styles.scoreText, { color: getScoreColor(compat.overallScore, colors) }]}>
                {compat.overallScore}%
              </Text>
            </View>
          </View>

          {/* 4-axis similarity bars */}
          <View style={styles.axes}>
            <AxisSimilarityBar
              label={t('personalityConformity')}
              value={compat.axisScores.conformity}
              color={colors.optionA}
            />
            <AxisSimilarityBar
              label={t('personalitySpeed')}
              value={compat.axisScores.speed}
              color={colors.accent}
            />
            <AxisSimilarityBar
              label={t('personalityDiversity')}
              value={compat.axisScores.diversity}
              color={colors.success}
            />
            <AxisSimilarityBar
              label={t('personalityCourage')}
              value={compat.axisScores.courage}
              color={colors.warning}
            />
          </View>

          {/* Common ground & differences */}
          {(compat.commonGround.length > 0 || compat.differences.length > 0) && (
            <View style={styles.analysis}>
              {compat.commonGround.length > 0 && (
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>{t('commonGround')}:</Text>
                  <Text style={styles.analysisValue}>
                    {compat.commonGround.map((k) => t(k as TranslationKey)).join(', ')}
                  </Text>
                </View>
              )}
              {compat.differences.length > 0 && (
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>{t('differencesLabel')}:</Text>
                  <Text style={styles.analysisValue}>
                    {compat.differences.map((k) => t(k as TranslationKey)).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function getScoreColor(score: number, colors: ThemeColors): string {
  if (score >= 85) return colors.success;
  if (score >= 70) return colors.accent;
  if (score >= 50) return colors.text;
  if (score >= 30) return colors.warning;
  return colors.textMuted;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  noPersonality: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  scoreBadge: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '800',
  },
  axes: {
    gap: 8,
  },
  analysis: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: 10,
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 6,
  },
  analysisLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  analysisValue: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
});

const createBarStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    width: 60,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    width: 28,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
});
