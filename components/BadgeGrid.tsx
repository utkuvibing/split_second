import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BADGES, BadgeContext, UnlockedBadge, fetchBadgeContext } from '../lib/badges';
import { isPremiumBadge } from '../lib/premium';
import { useTheme } from '../lib/themeContext';
import { BadgeCard } from './BadgeCard';
import { t } from '../lib/i18n';

interface Props {
  unlockedBadges: UnlockedBadge[];
  userIsPremium?: boolean;
}

export function BadgeGrid({ unlockedBadges, userIsPremium = false }: Props) {
  const colors = useTheme();
  const [context, setContext] = useState<BadgeContext | null>(null);
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));

  useEffect(() => {
    fetchBadgeContext().then(setContext).catch(() => {});
  }, [unlockedBadges]);

  // Filter badges: free users only see non-premium badges
  const visibleBadges = BADGES.filter((badge) => {
    if (isPremiumBadge(badge.id) && !userIsPremium) return false;
    return true;
  });

  // Chunk badges into rows of 4
  const rows: typeof visibleBadges[] = [];
  for (let i = 0; i < visibleBadges.length; i += 4) {
    rows.push(visibleBadges.slice(i, i + 4));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((badge, colIdx) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              unlocked={unlockedIds.has(badge.id)}
              context={context}
              delay={rowIdx * 100 + colIdx * 50}
            />
          ))}
          {/* Fill remaining slots with empty views for consistent sizing */}
          {row.length < 4 &&
            Array.from({ length: 4 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.empty} />
            ))}
        </View>
      ))}

      {/* Show teaser for premium badges if user is free */}
      {!userIsPremium && (
        <View style={[styles.premiumHint, { backgroundColor: colors.surface }]}>
          <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
          <Text style={[styles.premiumText, { color: colors.textMuted }]}>
            +4 {t('premiumOnly')} {t('badges').toLowerCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  empty: {
    flex: 1,
  },
  premiumHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  premiumEmoji: {
    fontSize: 16,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
