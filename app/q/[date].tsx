import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { GradientButton } from '../../components/ui/GradientButton';
import { useAuth } from '../../hooks/useAuth';
import { useVote } from '../../hooks/useVote';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import { QuestionCard } from '../../components/QuestionCard';
import { CountdownTimer } from '../../components/CountdownTimer';
import { ResultBars } from '../../components/ResultBar';
import { LoadingScreen } from '../../components/LoadingScreen';
import { LockedQuestionCard } from '../../components/LockedQuestionCard';
import { hapticVote, hapticResult } from '../../lib/haptics';
import { supabase } from '../../lib/supabase';
import { Question } from '../../types/database';
import { isQuestionUnlocked } from '../../lib/questions';
import {
  getLocalDateKeyFromParams,
  isFutureLocalDate,
  isPastLocalDate,
  isTodayLocalDate,
} from '../../lib/date';
import { getResults } from '../../lib/votes';
import { t, localizeQuestion } from '../../lib/i18n';

const TIMER_SECONDS = 10;

export default function ChallengeScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { date: dateParam, slot } = useLocalSearchParams<{ date: string; slot?: string }>();
  const dateKey = useMemo(
    () => (dateParam ? getLocalDateKeyFromParams(dateParam) : null),
    [dateParam]
  );
  const { userId, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [communityResults, setCommunityResults] = useState<{
    count_a: number;
    count_b: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!userId || !dateKey) {
      if (!authLoading && dateParam && !dateKey) {
        setError(t('challengeDateInvalid'));
        setLoading(false);
      }
      return;
    }

    (async () => {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('scheduled_date', dateKey)
        .eq('is_active', true);

      if (slot) {
        query = query.eq('time_slot', slot);
      }

      const { data, error: fetchError } = await query.limit(1).single();

      if (fetchError) {
        setError(t('questionNotFound'));
      } else {
        setQuestion(localizeQuestion(data as Question));
      }
      setLoading(false);
    })();
  }, [userId, dateKey, dateParam, slot, authLoading]);

  const votingAllowed = useMemo(() => {
    if (!dateKey || !question) return false;
    if (isPastLocalDate(dateKey) || isFutureLocalDate(dateKey)) return false;
    if (isTodayLocalDate(dateKey) && !isQuestionUnlocked(question.time_slot)) return false;
    return true;
  }, [dateKey, question]);

  const { vote, userChoice, results, hasVoted, submitting, loading: voteLoading } = useVote(
    votingAllowed ? question?.id : undefined
  );

  useEffect(() => {
    if (!question || votingAllowed || hasVoted) return;
    getResults(question.id).then((r) => {
      if (r && r.total > 0) {
        setCommunityResults({
          count_a: r.count_a,
          count_b: r.count_b,
          total: r.total,
        });
      }
    });
  }, [question, votingAllowed, hasVoted]);

  const isLoading = authLoading || loading || (votingAllowed && voteLoading);
  const showQuestion = !isLoading && question && votingAllowed && !hasVoted;

  const handleVote = useCallback((choice: 'a' | 'b') => {
    hapticVote();
    vote(choice);
  }, [vote]);

  const handleTimerExpire = useCallback(() => {
    if (!hasVoted && question && votingAllowed) {
      const randomChoice = Math.random() < 0.5 ? 'a' : 'b';
      hapticVote();
      vote(randomChoice as 'a' | 'b');
    }
  }, [hasVoted, question, vote, votingAllowed]);

  const { timeLeft, progress } = useCountdownTimer(
    TIMER_SECONDS,
    handleTimerExpire,
    !!showQuestion
  );

  useEffect(() => {
    if (hasVoted && results) {
      hapticResult();
    }
  }, [hasVoted, results]);

  if (isLoading) return <LoadingScreen />;

  if (error || !question || !dateKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="link" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error ?? t('questionNotFound')}</Text>
          <GradientButton title={t('goHome')} onPress={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  if (hasVoted && results) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.challengeTag}>{t('challenge')}</Text>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <View style={styles.resultsContainer}>
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.questionTextResult}>{question.question_text}</Text>
          </Animated.View>
          <Animated.View entering={SlideInDown.duration(500).delay(200)}>
            <ResultBars
              optionA={question.option_a}
              optionB={question.option_b}
              countA={results.count_a}
              countB={results.count_b}
              total={results.total}
              userChoice={userChoice!}
              category={question.category}
            />
          </Animated.View>
          <Animated.View entering={FadeIn.delay(800)} style={{ marginHorizontal: 24 }}>
            <GradientButton title={t('goToTodayQuestion')} onPress={() => router.replace('/')} />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  if (!votingAllowed) {
    const closedMessage = isPastLocalDate(dateKey)
      ? t('challengePastClosed')
      : isFutureLocalDate(dateKey)
        ? t('challengeFutureClosed')
        : t('challengeLockedToday');

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.challengeTag}>{t('challenge')}</Text>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <View style={styles.resultsContainer}>
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.questionTextResult}>{question.question_text}</Text>
          </Animated.View>
          <Animated.View entering={FadeIn.delay(200)} style={styles.closedBanner}>
            <Ionicons name="lock-closed" size={32} color={colors.textMuted} />
            <Text style={styles.closedText}>{closedMessage}</Text>
          </Animated.View>
          {isTodayLocalDate(dateKey) && !isQuestionUnlocked(question.time_slot) && (
            <LockedQuestionCard timeSlot={question.time_slot} />
          )}
          {communityResults && communityResults.total > 0 && (
            <Animated.View entering={SlideInDown.duration(500).delay(300)}>
              <ResultBars
                optionA={question.option_a}
                optionB={question.option_b}
                countA={communityResults.count_a}
                countB={communityResults.count_b}
                total={communityResults.total}
                userChoice={undefined}
                category={question.category}
              />
            </Animated.View>
          )}
          <Animated.View entering={FadeIn.delay(800)} style={{ marginHorizontal: 24 }}>
            <GradientButton title={t('goToTodayQuestion')} onPress={() => router.replace('/')} />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.challengeTag}>{t('challenge')}</Text>
        <Text style={styles.logo}>Split Second</Text>
      </View>
      <CountdownTimer timeLeft={timeLeft} progress={progress} />
      <QuestionCard
        question={question}
        onVote={handleVote}
        disabled={submitting}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 4,
  },
  challengeTag: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  questionTextResult: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 30,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closedBanner: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  closedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
