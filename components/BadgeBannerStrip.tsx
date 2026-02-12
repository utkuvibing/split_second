import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { UnlockedBadge, getBadgeById } from '../lib/badges';
import { GlassCard } from './ui/GlassCard';
import { t, TranslationKey, getDateLocale } from '../lib/i18n';
import { RADIUS } from '../constants/ui';

interface Props {
  unlockedBadges: UnlockedBadge[];
}

export function BadgeBannerStrip({ unlockedBadges }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (unlockedBadges.length === 0) return null;

  // Sort by most recently unlocked
  const sorted = [...unlockedBadges].sort(
    (a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('badgeShowcase')}</Text>
      <FlatList
        data={sorted}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.badge_id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const badge = getBadgeById(item.badge_id);
          if (!badge) return null;

          const dateStr = new Date(item.unlocked_at).toLocaleDateString(getDateLocale(), {
            day: 'numeric',
            month: 'short',
          });

          return (
            <Animated.View entering={FadeInRight.delay(index * 80).duration(300)}>
              <GlassCard>
                <View style={styles.card}>
                  <View style={[styles.accentBorder, { backgroundColor: colors.accent }]} />
                  <View style={styles.cardContent}>
                    <Text style={styles.emoji}>{badge.emoji}</Text>
                    <Text style={styles.badgeTitle} numberOfLines={1}>
                      {t(badge.titleKey as TranslationKey)}
                    </Text>
                    <Text style={styles.date}>{dateStr}</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  list: {
    gap: 10,
  },
  card: {
    width: 140,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
  },
  accentBorder: {
    width: 3,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  emoji: {
    fontSize: 32,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
