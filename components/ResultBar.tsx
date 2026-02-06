import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useEffect, useState, useMemo } from 'react';
import { Colors } from '../constants/colors';
import { getCategoryInsight } from '../lib/insights';
import { t } from '../lib/i18n';

function SocialProofBadge({ userPercent }: { userPercent: number }) {
  const isMajority = userPercent >= 50;
  const color = isMajority ? Colors.success : Colors.warning;
  const message = isMajority
    ? t('socialProofMajority', { percent: userPercent })
    : t('socialProofMinority', { percent: userPercent });

  return (
    <Animated.View
      entering={FadeIn.delay(1000).duration(400)}
      style={[styles.socialProofContainer, { borderColor: color }]}
    >
      <Text style={[styles.socialProofText, { color }]}>
        {isMajority ? '🤝' : '🔥'} {message}
      </Text>
    </Animated.View>
  );
}

export function ResultBars({
  optionA,
  optionB,
  countA,
  countB,
  total,
  userChoice,
  category,
}: {
  optionA: string;
  optionB: string;
  countA: number;
  countB: number;
  total: number;
  userChoice: 'a' | 'b';
  category?: string;
}) {
  const percentA = total > 0 ? Math.round((countA / total) * 100) : 0;
  const percentB = total > 0 ? Math.round((countB / total) * 100) : 0;
  const userPercent = userChoice === 'a' ? percentA : percentB;

  return (
    <View style={styles.barsContainer}>
      <ResultBar
        label={optionA}
        percentage={percentA}
        count={countA}
        color={Colors.optionA}
        isUserChoice={userChoice === 'a'}
        delay={0}
      />
      <ResultBar
        label={optionB}
        percentage={percentB}
        count={countB}
        color={Colors.optionB}
        isUserChoice={userChoice === 'b'}
        delay={200}
      />
      <SocialProofBadge userPercent={userPercent} />
      {category && (
        <Animated.View entering={FadeIn.delay(1200).duration(400)}>
          <CategoryInsight category={category} userPercent={userPercent} />
        </Animated.View>
      )}
      <Text style={styles.totalVotes}>
        {t('totalVotesLabel', { count: total.toLocaleString() })}
      </Text>
    </View>
  );
}

function CategoryInsight({ category }: { category: string; userPercent: number }) {
  const message = useMemo(() => getCategoryInsight(category), [category]);
  return (
    <Text style={styles.insightText}>{message}</Text>
  );
}

function ResultBar({
  label,
  percentage,
  count,
  color,
  isUserChoice,
  delay,
}: {
  label: string;
  percentage: number;
  count: number;
  color: string;
  isUserChoice: boolean;
  delay: number;
}) {
  const animatedWidth = useSharedValue(0);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    animatedWidth.value = withDelay(
      delay,
      withTiming(percentage, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    const startTime = Date.now() + delay;
    const duration = 800;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.round(eased * percentage));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [percentage]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.max(animatedWidth.value, 2)}%`,
  }));

  return (
    <View style={styles.resultItem}>
      <View style={styles.labelRow}>
        <Text
          style={[styles.label, isUserChoice && styles.labelHighlight]}
          numberOfLines={2}
        >
          {isUserChoice ? '\u2713 ' : ''}{label}
        </Text>
        <Text style={[styles.percentage, { color }]}>{displayPercent}%</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, barStyle]} />
      </View>
      <Text style={styles.voteCount}>
        {count.toLocaleString()} {count === 1 ? t('voteSingular') : t('votePlural')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  barsContainer: {
    gap: 24,
    paddingHorizontal: 24,
  },
  resultItem: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textMuted,
    flex: 1,
    marginRight: 12,
  },
  labelHighlight: {
    color: Colors.text,
    fontWeight: '700',
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  barTrack: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  voteCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  totalVotes: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  socialProofContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  insightText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
