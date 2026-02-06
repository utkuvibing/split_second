import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { useAuth } from '../../hooks/useAuth';
import { useVote } from '../../hooks/useVote';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import { QuestionCard } from '../../components/QuestionCard';
import { CountdownTimer } from '../../components/CountdownTimer';
import { ResultBars } from '../../components/ResultBar';
import { LoadingScreen } from '../../components/LoadingScreen';
import { hapticVote, hapticResult } from '../../lib/haptics';
import { supabase } from '../../lib/supabase';
import { Question } from '../../types/database';
import { t, localizeQuestion } from '../../lib/i18n';

const TIMER_SECONDS = 10;

export default function ChallengeScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { date } = useLocalSearchParams<{ date: string }>();
  const { userId, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch question by date
  useEffect(() => {
    if (!userId || !date) return;

    (async () => {
      const { data, error: fetchError } = await supabase
        .from('questions')
        .select('*')
        .eq('scheduled_date', date)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        setError(t('questionNotFound'));
      } else {
        setQuestion(localizeQuestion(data as Question));
      }
      setLoading(false);
    })();
  }, [userId, date]);

  const { vote, userChoice, results, hasVoted, submitting, loading: voteLoading } = useVote(question?.id);

  const isLoading = authLoading || loading || voteLoading;
  const showQuestion = !isLoading && question && !hasVoted;

  const handleVote = useCallback((choice: 'a' | 'b') => {
    hapticVote();
    vote(choice);
  }, [vote]);

  const handleTimerExpire = useCallback(() => {
    if (!hasVoted && question) {
      const randomChoice = Math.random() < 0.5 ? 'a' : 'b';
      hapticVote();
      vote(randomChoice as 'a' | 'b');
    }
  }, [hasVoted, question, vote]);

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

  if (error || !question) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>🔗</Text>
          <Text style={styles.errorText}>{error ?? t('questionNotFound')}</Text>
          <Pressable style={styles.retryButton} onPress={() => router.replace('/')}>
            <Text style={styles.retryText}>{t('goHome')}</Text>
          </Pressable>
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
          <Animated.View entering={FadeIn.delay(800)}>
            <Pressable style={styles.homeButton} onPress={() => router.replace('/')}>
              <Text style={styles.homeButtonText}>{t('goToTodayQuestion')}</Text>
            </Pressable>
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
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  homeButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
