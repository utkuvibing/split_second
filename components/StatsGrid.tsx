import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StatCard } from './StatCard';
import { UserStats } from '../lib/stats';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  stats: UserStats;
}

const categoryKeys: Record<string, TranslationKey> = {
  superpower: 'catSuperpower',
  lifestyle: 'catLifestyle',
  philosophy: 'catPhilosophy',
  technology: 'catTechnology',
  food: 'catFood',
  skills: 'catSkills',
  personality: 'catPersonality',
  entertainment: 'catEntertainment',
  adventure: 'catAdventure',
  funny: 'catFunny',
};

export function StatsGrid({ stats }: Props) {
  const catKey = categoryKeys[stats.top_category];
  const topCategoryLabel = catKey ? t(catKey) : stats.top_category;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.row}>
        <StatCard
          emoji="🗳️"
          value={stats.total_votes.toString()}
          label={t('totalVotesStat')}
        />
        <StatCard
          emoji="🔥"
          value={stats.current_streak.toString()}
          label={t('dailyStreak')}
        />
        <StatCard
          emoji="🏆"
          value={stats.longest_streak.toString()}
          label={t('longestStreakStat')}
        />
      </View>
      <View style={styles.row}>
        <StatCard
          emoji="🤝"
          value={`%${stats.majority_percent}`}
          label={t('withMajority')}
        />
        <StatCard
          emoji="🏷️"
          value={topCategoryLabel}
          label={t('favoriteCategory')}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
