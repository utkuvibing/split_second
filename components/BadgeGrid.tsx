import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BADGES, BadgeContext, UnlockedBadge, fetchBadgeContext } from '../lib/badges';
import { BadgeCard } from './BadgeCard';

interface Props {
  unlockedBadges: UnlockedBadge[];
}

export function BadgeGrid({ unlockedBadges }: Props) {
  const [context, setContext] = useState<BadgeContext | null>(null);
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));

  useEffect(() => {
    fetchBadgeContext().then(setContext).catch(() => {});
  }, [unlockedBadges]);

  // Chunk badges into rows of 4
  const rows: typeof BADGES[] = [];
  for (let i = 0; i < BADGES.length; i += 4) {
    rows.push(BADGES.slice(i, i + 4));
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
});
