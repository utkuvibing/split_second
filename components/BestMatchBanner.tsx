import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { FriendCompatibility } from '../hooks/useCompatibility';
import { getCompatibilityLabelKey } from '../lib/compatibility';
import { AvatarDisplay } from './AvatarDisplay';
import { t, TranslationKey } from '../lib/i18n';
import { RADIUS, SHADOW } from '../constants/ui';
import { getFriendDisplayName } from '../lib/friends';

interface Props {
  match: FriendCompatibility;
}

export function BestMatchBanner({ match }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const compat = match.compatibility;

  if (!compat) return null;

  const name = getFriendDisplayName(match.friend_code, match.friend_display_name);
  const isSoulmate = compat.overallScore >= 85;
  const labelKey = getCompatibilityLabelKey(compat.label);

  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <LinearGradient
        colors={[colors.accent + '30', colors.success + '20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, SHADOW.md]}
      >
        <View style={styles.inner}>
          <Text style={styles.heading}>{t('bestMatch')}</Text>
          <View style={styles.content}>
            <AvatarDisplay avatarId={match.friend_avatar_id ?? null} size={56} />
            <View style={styles.info}>
              <Text style={styles.name}>{name}</Text>
              <Text style={[styles.label, { color: isSoulmate ? colors.success : colors.accent }]}>
                {isSoulmate ? t('soulmate') : t(labelKey as TranslationKey)}
              </Text>
            </View>
            <View style={[styles.scoreBadge, {
              borderColor: isSoulmate ? colors.success : colors.accent,
            }]}>
              <Text style={[styles.scoreText, {
                color: isSoulmate ? colors.success : colors.accent,
              }]}>
                {compat.overallScore}%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  gradient: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  inner: {
    padding: 16,
    gap: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  scoreBadge: {
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
  },
});
