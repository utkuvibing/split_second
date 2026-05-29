import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import {
  PersonalityType,
  PersonalityAxes,
  ContentAxes,
  AxisConfidence,
  DatingProfile,
  CONTENT_AXES,
  CONTENT_AXIS_LABEL_KEYS,
  DATING_PROFILE_UNLOCK_VOTES,
} from '../lib/personality';
import { t, TranslationKey } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';
import { GlassCard } from './ui/GlassCard';

interface Props {
  personality: PersonalityType;
  axes: PersonalityAxes | null;
  behavioralReady: boolean;
  contentAxes?: Partial<ContentAxes> | null;
  contentReady: boolean;
  contentUnlocked: boolean;
  axisConfidence?: AxisConfidence | null;
  isPremium: boolean;
}

function AxisBar({
  label,
  value,
  color,
  lowConfidence,
}: {
  label: string;
  value: number;
  color: string;
  lowConfidence?: boolean;
}) {
  const colors = useTheme();
  const barStyles = createBarStyles(colors);
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={[barStyles.barBg, lowConfidence && { opacity: 0.5 }]}>
        <View style={[barStyles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[barStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const TEASER_AXES = ['risk_tolerance', 'independence', 'emotionality'] as const;

export function PersonalityDetailCard({
  personality,
  axes,
  behavioralReady,
  contentAxes,
  contentReady,
  contentUnlocked,
  axisConfidence,
  isPremium,
}: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <GlassCard style={SHADOW.sm}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.emoji}>{personality.emoji}</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {t(personality.titleKeyTr as TranslationKey)}
              </Text>
              <Text style={styles.desc}>
                {t(personality.descKeyTr as TranslationKey)}
              </Text>
            </View>
          </View>

          <Text style={styles.disclaimer}>{t('personalityDisclaimer')}</Text>

          {isPremium ? (
            <View style={styles.axes}>
              <Text style={styles.sectionLabel}>{t('personalityBehavioralSection')}</Text>
              {behavioralReady && axes ? (
                <>
                  <AxisBar label={t('personalityConformity')} value={axes.conformity} color={colors.optionA} />
                  <AxisBar label={t('personalitySpeed')} value={axes.speed} color={colors.accent} />
                  <AxisBar label={t('personalityDiversity')} value={axes.diversity} color={colors.success} />
                  <AxisBar label={t('personalityCourage')} value={axes.courage} color={colors.warning} />
                </>
              ) : (
                <Text style={styles.updatingText}>{t('personalityBehavioralUpdating')}</Text>
              )}

              {contentReady && contentAxes && Object.keys(contentAxes).length > 0 ? (
                <>
                  <Text style={[styles.sectionLabel, styles.sectionGap]}>{t('personalityContentSection')}</Text>
                  {CONTENT_AXES.map((axis) => {
                    const val = contentAxes[axis];
                    if (val == null) return null;
                    const conf = axisConfidence?.content?.[axis] ?? 1;
                    return (
                      <AxisBar
                        key={axis}
                        label={t(CONTENT_AXIS_LABEL_KEYS[axis] as TranslationKey)}
                        value={val}
                        color={colors.accent}
                        lowConfidence={conf < 0.5}
                      />
                    );
                  })}
                  {axisConfidence?.content && Object.values(axisConfidence.content).some((c) => c < 0.5) && (
                    <Text style={styles.lowConfHint}>{t('personalityLowConfidence')}</Text>
                  )}
                </>
              ) : contentUnlocked ? (
                <Text style={[styles.updatingText, styles.sectionGap]}>{t('personalityContentUpdating')}</Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.freeSection}>
              {contentReady && contentAxes && TEASER_AXES.map((axis) => {
                const val = contentAxes[axis];
                if (val == null) return null;
                return (
                  <AxisBar
                    key={axis}
                    label={t(CONTENT_AXIS_LABEL_KEYS[axis] as TranslationKey)}
                    value={val}
                    color={colors.accent}
                  />
                );
              })}
              <View style={styles.premiumHint}>
                <Text style={styles.premiumHintText}>{t('premiumUnlock')}</Text>
              </View>
            </View>
          )}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export function DatingProfileCard({
  datingProfile,
  datingVotesCount,
  isPremium,
}: {
  datingProfile: DatingProfile | null;
  datingVotesCount: number;
  isPremium: boolean;
}) {
  const colors = useTheme();
  const styles = createStyles(colors);

  const remaining = Math.max(0, DATING_PROFILE_UNLOCK_VOTES - datingVotesCount);
  const locked =
    !datingProfile?.unlocked ||
    (datingProfile.confidence ?? 0) < 0.5 ||
    datingVotesCount < DATING_PROFILE_UNLOCK_VOTES;

  if (locked) {
    return (
      <GlassCard style={SHADOW.sm}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('datingProfileTitle')}</Text>
          <Text style={styles.lockedText}>
            {t('datingProfileLocked', { remaining: String(remaining) })}
          </Text>
        </View>
      </GlassCard>
    );
  }

  if (!isPremium) {
    return (
      <GlassCard style={SHADOW.sm}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('datingProfileTitle')}</Text>
          <Text style={styles.lockedText}>{t('premiumUnlock')}</Text>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={SHADOW.sm}>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('datingProfileTitle')}</Text>
        <Text style={styles.disclaimer}>{t('datingDisclaimer')}</Text>
        <ProfileRow label={t('datingAttachment')} value={t(`datingAttachment_${datingProfile!.attachment_style}` as TranslationKey)} />
        <ProfileRow label={t('datingCommunication')} value={t(`datingComm_${datingProfile!.communication_style}` as TranslationKey)} />
        <ProfileRow label={t('datingRomance')} value={t(`datingRomance_${datingProfile!.romance_style}` as TranslationKey)} />
        <ProfileRow label={t('datingPrivacy')} value={t(`datingPrivacy_${datingProfile!.privacy_style}` as TranslationKey)} />
        <ProfileRow label={t('datingConflict')} value={t(`datingConflict_${datingProfile!.conflict_style}` as TranslationKey)} />
        <AxisBar label={t('datingPace')} value={datingProfile!.dating_pace} color={colors.accent} />
        <AxisBar label={t('datingTogetherness')} value={datingProfile!.togetherness} color={colors.success} />
      </View>
    </GlassCard>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '600' }}>{label}</Text>
      <Text style={{ fontSize: 12, color: colors.text, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: { fontSize: 40 },
  headerText: { flex: 1, gap: 4 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  disclaimer: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', lineHeight: 15 },
  axes: { gap: 8 },
  freeSection: { gap: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  sectionGap: { marginTop: 4 },
  lowConfHint: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  premiumHint: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  premiumHintText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  lockedText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  updatingText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
});

const createBarStyles = (colors: ThemeColors) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 88, fontSize: 11, fontWeight: '600', color: colors.textMuted },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  value: { width: 28, fontSize: 12, fontWeight: '700', textAlign: 'right' },
});
