import { useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useTodayQuestion } from '../../hooks/useTodayQuestion';
import { useVote } from '../../hooks/useVote';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import { LoadingScreen } from '../../components/LoadingScreen';
import { QuestionCard } from '../../components/QuestionCard';
import { CountdownTimer } from '../../components/CountdownTimer';
import { ResultBars } from '../../components/ResultBar';
import { DailyCountdown } from '../../components/DailyCountdown';
import { NoQuestion } from '../../components/NoQuestion';
import { ShareButton } from '../../components/ShareButton';
import { shareResult, shareImage } from '../../lib/share';
import { ShareCard } from '../../components/ShareCard';
import { hapticVote, hapticResult } from '../../lib/haptics';
import { StreakBadge } from '../../components/StreakBadge';
import { ChallengeButton } from '../../components/ChallengeButton';
import { shareChallenge } from '../../lib/deeplink';
import { useGlobalStats } from '../../hooks/useGlobalStats';
import { GlobalStatsBanner } from '../../components/GlobalStatsBanner';
import { Confetti } from '../../components/Confetti';
import { isNewMilestone } from '../../lib/streaks';
import { scheduleDailyReminder, scheduleStreakReminder } from '../../lib/notifications';
import { t } from '../../lib/i18n';

const TIMER_SECONDS = 10;

export default function HomeScreen() {
  const { userId, loading: authLoading } = useAuth();
  const { question, loading: questionLoading, error, refetch } = useTodayQuestion(!!userId);
  const { vote, userChoice, results, hasVoted, submitting, loading: voteLoading } = useVote(question?.id);

  const { stats: globalStats } = useGlobalStats();
  const shareCardRef = useRef<View>(null);
  const isLoading = authLoading || questionLoading || voteLoading;
  const showQuestion = !isLoading && question && !hasVoted;

  const handleVote = useCallback((choice: 'a' | 'b') => {
    hapticVote();
    vote(choice);
  }, [vote]);

  const handleTimerExpire = useCallback(() => {
    if (!hasVoted && question) {
      // Random choice when timer expires
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

  // Haptic feedback when results appear + schedule notifications
  useEffect(() => {
    if (hasVoted && results) {
      hapticResult();
      scheduleDailyReminder();
      if (results.current_streak) {
        scheduleStreakReminder(results.current_streak);
      }
    }
  }, [hasVoted, results]);

  // Hide splash when ready
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{t('somethingWentWrong')}</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>{t('tryAgain')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // No question today
  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <NoQuestion />
      </SafeAreaView>
    );
  }

  // Results state (already voted or just voted)
  if (hasVoted && results) {
    const percentA = results.total > 0 ? Math.round((results.count_a / results.total) * 100) : 0;
    const percentB = results.total > 0 ? Math.round((results.count_b / results.total) * 100) : 0;
    const userPercent = userChoice === 'a' ? percentA : percentB;
    const userChoiceText = userChoice === 'a' ? question.option_a : question.option_b;

    const showConfetti = results.current_streak != null && isNewMilestone(results.current_streak);

    return (
      <SafeAreaView style={styles.container}>
        {showConfetti && <Confetti />}
        <View style={styles.header}>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <View style={styles.resultsContainer}>
          <View style={styles.resultsContent}>
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
            {results.current_streak != null && results.current_streak > 0 && (
              <Animated.View entering={FadeIn.delay(1000).duration(400)}>
                <StreakBadge
                  currentStreak={results.current_streak}
                  longestStreak={results.longest_streak ?? results.current_streak}
                />
              </Animated.View>
            )}
            <ShareButton
              onPress={() => shareResult({
                questionText: question.question_text,
                userChoice: userChoiceText,
                userPercent,
              })}
              onImageShare={() => shareImage(shareCardRef)}
            />
            <ChallengeButton
              onPress={() => shareChallenge(question.question_text, question.scheduled_date)}
            />
          </View>
          <View style={styles.countdownFill}>
            <Animated.View entering={FadeIn.delay(800)}>
              <DailyCountdown />
            </Animated.View>
          </View>
        </View>
        {/* Hidden share card for screenshot */}
        <View style={styles.hiddenCard}>
          <ShareCard
            ref={shareCardRef}
            questionText={question.question_text}
            optionA={question.option_a}
            optionB={question.option_b}
            percentA={percentA}
            percentB={percentB}
            userChoice={userChoice!}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Question state (not yet voted)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
        {globalStats && globalStats.today_votes > 0 && (
          <GlobalStatsBanner todayVotes={globalStats.today_votes} />
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    gap: 24,
    paddingTop: 8,
  },
  countdownFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionTextResult: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
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
    color: Colors.text,
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  hiddenCard: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
});
