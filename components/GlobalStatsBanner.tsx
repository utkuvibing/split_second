import { Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { t } from '../lib/i18n';

interface Props {
  todayVotes: number;
}

export function GlobalStatsBanner({ todayVotes }: Props) {
  const colors = useTheme();
  if (todayVotes === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Text style={[styles.text, { color: colors.textMuted }]}>
        {t('todayVotedCount', { count: todayVotes.toLocaleString() })}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
