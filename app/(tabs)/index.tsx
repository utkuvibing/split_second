import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { useAuth } from '../../hooks/useAuth';
import { useTodayQuestion } from '../../hooks/useTodayQuestion';
import { useVote } from '../../hooks/useVote';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import { useBadges } from '../../hooks/useBadges';
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
import { BadgeUnlockToast } from '../../components/BadgeUnlockToast';
import { PostVoteInsights } from '../../components/PostVoteInsights';
import { ChallengeButton } from '../../components/ChallengeButton';
import { shareChallenge } from '../../lib/deeplink';
import { usePremium } from '../../hooks/usePremium';
import { useGlobalStats } from '../../hooks/useGlobalStats';
import { GlobalStatsBanner } from '../../components/GlobalStatsBanner';
import { Confetti } from '../../components/Confetti';
import { VoteEffect } from '../../components/VoteEffect';
import { isNewMilestone } from '../../lib/streaks';
import { getNextBadgeProgress } from '../../lib/badges';
import { fetchBadgeContext } from '../../lib/badges';
import { scheduleDailyReminder, scheduleStreakReminder } from '../../lib/notifications';
import { t } from '../../lib/i18n';

const TIMER_SECONDS = 10;

export default function HomeScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { userId, loading: authLoading } = useAuth();
  const { question, loading: questionLoading, error, refetch } = useTodayQuestion(!!userId);
  const { vote, userChoice, results, hasVoted, submitting, loading: voteLoading, voteTimeSeconds, coinsEarned } = useVote(question?.id);
  const { unlockedBadges, checkNewUnlocks } = useBadges();
  const { isPremium, equippedEffect } = usePremium();

  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);
  const [nextBadgeProg, setNextBadgeProg] = useState<{ badge: any; current: number; target: number } | null>(null);
  const badgeCheckDone = useRef(false);

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

  // Haptic feedback when results appear + schedule notifications + badge check
  useEffect(() => {
    if (hasVoted && results) {
      hapticResult();
      scheduleDailyReminder();
      if (results.current_streak) {
        scheduleStreakReminder(results.current_streak);
      }

      // Check for new badge unlocks (only once per vote)
      if (!badgeCheckDone.current) {
        badgeCheckDone.current = true;
        const hour = new Date().getHours();
        checkNewUnlocks({
          vote_time_seconds: voteTimeSeconds ?? undefined,
          vote_hour: hour,
        }).then((newIds) => {
          if (newIds.length > 0) {
            setNewBadgeId(newIds[0]);
          }
        }).catch(() => {});

        // Fetch next badge progress
        fetchBadgeContext().then((ctx) => {
          if (ctx) {
            const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));
            const prog = getNextBadgeProgress(ctx, unlockedIds);
            setNextBadgeProg(prog);
          }
        }).catch(() => {});
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
    const hasEquippedEffect = equippedEffect && equippedEffect !== 'default';

    return (
      <SafeAreaView style={styles.container}>
        {hasEquippedEffect
          ? <VoteEffect effectId={equippedEffect} />
          : showConfetti ? <Confetti /> : null
        }
        <View style={styles.header}>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <ScrollView
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsScrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            {/* Badge unlock toast */}
            {newBadgeId && (
              <Animated.View entering={FadeIn.delay(600).duration(300)}>
                <BadgeUnlockToast
                  badgeId={newBadgeId}
                  onDone={() => setNewBadgeId(null)}
                />
              </Animated.View>
            )}
            {/* Post-vote insights */}
            <PostVoteInsights
              countA={results.count_a}
              countB={results.count_b}
              total={results.total}
              nextBadgeProgress={nextBadgeProg}
              isPremium={isPremium}
            />
            {results.current_streak != null && results.current_streak > 0 && (
              <Animated.View entering={FadeIn.delay(1000).duration(400)}>
                <StreakBadge
                  currentStreak={results.current_streak}
                  longestStreak={results.longest_streak ?? results.current_streak}
                />
              </Animated.View>
            )}
            {coinsEarned > 0 && (
              <Animated.View entering={FadeIn.delay(1200).duration(400)} style={styles.coinToast}>
                <Text style={styles.coinToastText}>
                  {coinsEarned > 10
                    ? t('coinEarnedStreak', { amount: String(coinsEarned) })
                    : t('coinEarned', { amount: String(coinsEarned) })
                  }
                </Text>
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
          <Animated.View entering={FadeIn.delay(800)} style={styles.countdownFill}>
            <DailyCountdown />
          </Animated.View>
        </ScrollView>
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
  },
  resultsScrollContent: {
    gap: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  countdownFill: {
    alignItems: 'center',
    paddingVertical: 16,
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
  errorDetail: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
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
  coinToast: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  coinToastText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.warning,
  },
  hiddenCard: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
});
