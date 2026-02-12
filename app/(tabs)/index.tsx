import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { SHADOW, GLASS, RADIUS } from '../../constants/ui';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { Question, VoteResults } from '../../types/database';
import { useAuth } from '../../hooks/useAuth';
import { useTodayQuestions } from '../../hooks/useTodayQuestions';
import { useBadges } from '../../hooks/useBadges';
import { LoadingScreen } from '../../components/LoadingScreen';
import { QuestionCarousel } from '../../components/QuestionCarousel';
import { ResultBars } from '../../components/ResultBar';
import { DailyCountdown } from '../../components/DailyCountdown';
import { NoQuestion } from '../../components/NoQuestion';
import { ShareButton } from '../../components/ShareButton';
import { shareResult, shareImage } from '../../lib/share';
import { ShareCard } from '../../components/ShareCard';
import { hapticResult } from '../../lib/haptics';
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
import { usePersonality } from '../../hooks/usePersonality';
import { PersonalityRevealModal } from '../../components/PersonalityRevealModal';
import { useFriendVotes } from '../../hooks/useFriendVotes';
import { FriendVotesFeed } from '../../components/FriendVotesFeed';
import { isQuestionUnlocked } from '../../lib/questions';
import { useMysteryBox } from '../../hooks/useMysteryBox';
import { MysteryBoxDrop } from '../../components/MysteryBoxDrop';
import { MysteryBoxOpenModal } from '../../components/MysteryBoxOpenModal';
import { BoxRarity, RewardType } from '../../lib/mysteryBox';
import { useLiveEvent } from '../../hooks/useLiveEvent';
import { LiveEventBanner } from '../../components/LiveEventBanner';
import { LiveEventModal } from '../../components/LiveEventModal';
import { t } from '../../lib/i18n';

// Per-question vote state tracking
interface QuestionVoteState {
  userChoice: 'a' | 'b' | null;
  results: VoteResults | null;
  hasVoted: boolean;
  submitting: boolean;
  coinsEarned: number;
}

export default function HomeScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { userId, loading: authLoading } = useAuth();
  const { questions, loading: questionLoading, error, refetch } = useTodayQuestions(!!userId);
  const { unlockedBadges, checkNewUnlocks } = useBadges();
  const { isPremium, equippedEffect } = usePremium();
  const { personality, isFirstReveal, recalculate: recalcPersonality } = usePersonality();
  const [showPersonalityReveal, setShowPersonalityReveal] = useState(false);
  const personalityCheckDone = useRef(false);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);
  const [nextBadgeProg, setNextBadgeProg] = useState<{ badge: any; current: number; target: number } | null>(null);
  const badgeCheckDone = useRef(false);
  const { stats: globalStats } = useGlobalStats();
  const { checkDrop, openBox, lastDrop, lastOpen, clearDrop, clearOpen } = useMysteryBox();
  const [showBoxDrop, setShowBoxDrop] = useState(false);
  const [showBoxOpen, setShowBoxOpen] = useState(false);
  const [pendingBoxId, setPendingBoxId] = useState<string | null>(null);
  const [pendingBoxRarity, setPendingBoxRarity] = useState<BoxRarity | null>(null);
  const {
    event: liveEvent, countA: liveCountA, countB: liveCountB,
    timeRemaining: liveTimeRemaining, userChoice: liveUserChoice,
    coinsEarned: liveCoinsEarned, vote: liveVote,
  } = useLiveEvent();
  const [showLiveModal, setShowLiveModal] = useState(false);
  const shareCardRef = useRef<View>(null);

  // Track vote states per question
  const [voteStates, setVoteStates] = useState<Record<string, QuestionVoteState>>({});

  // Last vote result for showing post-vote info
  const [lastVoteResult, setLastVoteResult] = useState<{
    question: Question;
    results: VoteResults;
    userChoice: 'a' | 'b';
    coinsEarned: number;
  } | null>(null);

  // Use useVote hooks for each question - but we need to handle this differently
  // since we have multiple questions. We'll use the submitVote function directly.
  const { submitVote: submitVoteFn, markShown } = useMultiVote();

  // Mark questions as shown when they become available
  useEffect(() => {
    for (const q of questions) {
      if (isQuestionUnlocked(q.time_slot) && !voteStates[q.id]?.hasVoted) {
        markShown(q.id);
      }
    }
  }, [questions, voteStates, markShown]);

  // Check existing votes for all questions
  useEffect(() => {
    if (questions.length === 0) return;
    const loadExistingVotes = async () => {
      const { getUserVote, getResults } = await import('../../lib/votes');
      const states: Record<string, QuestionVoteState> = {};
      for (const q of questions) {
        const existingChoice = await getUserVote(q.id);
        if (existingChoice) {
          const existingResults = await getResults(q.id);
          states[q.id] = {
            userChoice: existingChoice,
            results: existingResults,
            hasVoted: true,
            submitting: false,
            coinsEarned: 0,
          };
        } else {
          states[q.id] = {
            userChoice: null,
            results: null,
            hasVoted: false,
            submitting: false,
            coinsEarned: 0,
          };
        }
      }
      setVoteStates(states);

      // Populate lastVoteResult from loaded votes so results view renders on remount
      const lastVotedQ = [...questions].reverse().find(
        q => states[q.id]?.hasVoted && states[q.id]?.results
      );
      if (lastVotedQ) {
        setLastVoteResult({
          question: lastVotedQ,
          results: states[lastVotedQ.id].results!,
          userChoice: states[lastVotedQ.id].userChoice!,
          coinsEarned: 0,
        });
      }
    };
    loadExistingVotes();
  }, [questions]);

  // Friend votes for the last voted question
  const lastVotedQuestion = lastVoteResult?.question;
  const { friendVotes } = useFriendVotes(lastVotedQuestion?.id, !!lastVoteResult);

  const isLoading = authLoading || questionLoading;

  // Build carousel items
  const carouselItems = useMemo(() => {
    return questions.map(q => ({
      question: q,
      hasVoted: voteStates[q.id]?.hasVoted ?? false,
      isLocked: !isQuestionUnlocked(q.time_slot),
    }));
  }, [questions, voteStates]);

  const allVoted = questions.length > 0 && questions.every(q => voteStates[q.id]?.hasVoted);
  const votedCount = questions.filter(q => voteStates[q.id]?.hasVoted).length;
  const hasAnyUnvotedUnlocked = carouselItems.some(item => !item.hasVoted && !item.isLocked);

  const handleVote = useCallback(async (questionId: string, choice: 'a' | 'b') => {
    setVoteStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], submitting: true },
    }));

    const question = questions.find(q => q.id === questionId);
    const result = await submitVoteFn(questionId, choice);

    if (result) {
      const newState: QuestionVoteState = {
        userChoice: choice,
        results: result,
        hasVoted: true,
        submitting: false,
        coinsEarned: result.coins_earned ?? 0,
      };

      setVoteStates(prev => ({
        ...prev,
        [questionId]: newState,
      }));

      if (question) {
        setLastVoteResult({
          question,
          results: result,
          userChoice: choice,
          coinsEarned: result.coins_earned ?? 0,
        });
      }
    } else {
      setVoteStates(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], submitting: false },
      }));
    }
  }, [questions, submitVoteFn]);

  // Post-vote effects
  useEffect(() => {
    if (!lastVoteResult) return;
    const { results } = lastVoteResult;

    hapticResult();
    scheduleDailyReminder();
    if (results.current_streak) {
      scheduleStreakReminder(results.current_streak);
    }

    // Mystery box drop check (separate from vote path - non-blocking)
    checkDrop().then((drop) => {
      if (drop.dropped && drop.box_id && drop.rarity) {
        setPendingBoxId(drop.box_id);
        setPendingBoxRarity(drop.rarity as BoxRarity);
        setTimeout(() => setShowBoxDrop(true), 1500);
      }
    }).catch(() => {});

    // Badge check (only on first vote result per session, or when all voted)
    if (!badgeCheckDone.current && results.all_today_voted) {
      badgeCheckDone.current = true;
      const hour = new Date().getHours();
      checkNewUnlocks({
        vote_hour: hour,
      }).then((newIds) => {
        if (newIds.length > 0) {
          setNewBadgeId(newIds[0]);
        }
      }).catch(() => {});

      fetchBadgeContext().then((ctx) => {
        if (ctx) {
          const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));
          const prog = getNextBadgeProgress(ctx, unlockedIds);
          setNextBadgeProg(prog);
        }
      }).catch(() => {});
    }

    // Personality reveal
    if (!personalityCheckDone.current) {
      personalityCheckDone.current = true;
      recalcPersonality().then((type) => {
        if (type && isFirstReveal) {
          setTimeout(() => setShowPersonalityReveal(true), 2000);
        }
      }).catch(() => {});
    }
  }, [lastVoteResult]);

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
          <Ionicons name="warning" size={48} color={colors.warning} />
          <Text style={styles.errorText}>{t('somethingWentWrong')}</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <GradientButton title={t('tryAgain')} onPress={refetch} />
        </View>
      </SafeAreaView>
    );
  }

  // No questions today
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <NoQuestion />
      </SafeAreaView>
    );
  }

  // All questions voted - show results summary
  if (allVoted && lastVoteResult) {
    const { question, results, userChoice, coinsEarned } = lastVoteResult;
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
          {/* Day complete banner */}
          <Animated.View entering={FadeIn.duration(400)} style={{ marginHorizontal: 24 }}>
            <GlassCard>
              <View style={styles.dayCompleteContainer}>
                <Text style={styles.dayCompleteText}>{t('dayComplete')}</Text>
                <Text style={styles.dayCompleteSubtext}>
                  {t('questionsCompleted', { count: String(questions.length) })}
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

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
              userChoice={userChoice}
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
            <Animated.View entering={FadeIn.delay(1200).duration(400)} style={{ marginHorizontal: 24 }}>
              <GlassCard style={SHADOW.sm}>
                <View style={styles.coinToast}>
                  <Text style={styles.coinToastText}>
                    {coinsEarned > 5
                      ? t('coinEarnedStreak', { amount: String(coinsEarned) })
                      : t('coinEarned', { amount: String(coinsEarned) })
                    }
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>
          )}
          {/* Friend votes feed */}
          {friendVotes.length > 0 && question && (
            <FriendVotesFeed
              friendVotes={friendVotes}
              optionA={question.option_a}
              optionB={question.option_b}
            />
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
            userChoice={userChoice}
          />
        </View>
        {/* Personality reveal modal */}
        {personality && (
          <PersonalityRevealModal
            visible={showPersonalityReveal}
            personality={personality}
            onClose={() => setShowPersonalityReveal(false)}
          />
        )}
        {/* Mystery box drop notification */}
        {showBoxDrop && pendingBoxRarity && (
          <MysteryBoxDrop
            rarity={pendingBoxRarity}
            onOpen={() => {
              setShowBoxDrop(false);
              if (pendingBoxId) {
                openBox(pendingBoxId).then(() => setShowBoxOpen(true));
              }
            }}
            onDismiss={() => {
              setShowBoxDrop(false);
              clearDrop();
            }}
          />
        )}
        {/* Mystery box open modal */}
        <MysteryBoxOpenModal
          visible={showBoxOpen}
          rarity={lastOpen?.rarity as BoxRarity ?? null}
          rewardType={lastOpen?.reward_type as RewardType ?? null}
          rewardValue={lastOpen?.reward_value ?? null}
          onClose={() => {
            setShowBoxOpen(false);
            clearOpen();
            setPendingBoxId(null);
            setPendingBoxRarity(null);
          }}
        />
      </SafeAreaView>
    );
  }

  // Show per-question results for just-voted question (not all done yet)
  if (lastVoteResult && !hasAnyUnvotedUnlocked) {
    // All unlocked questions voted, but locked ones remain
    const { question, results, userChoice, coinsEarned } = lastVoteResult;
    const percentA = results.total > 0 ? Math.round((results.count_a / results.total) * 100) : 0;
    const percentB = results.total > 0 ? Math.round((results.count_b / results.total) * 100) : 0;
    const userChoiceText = userChoice === 'a' ? question.option_a : question.option_b;
    const userPercent = userChoice === 'a' ? percentA : percentB;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Split Second</Text>
        </View>
        <ScrollView
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressBanner}>
            <Text style={styles.progressBannerText}>
              {t('questionsProgress', { voted: String(votedCount), total: String(questions.length) })}
            </Text>
          </Animated.View>
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
              userChoice={userChoice}
              category={question.category}
            />
          </Animated.View>
          {coinsEarned > 0 && (
            <Animated.View entering={FadeIn.delay(600).duration(400)} style={{ marginHorizontal: 24 }}>
              <GlassCard style={SHADOW.sm}>
                <View style={styles.coinToast}>
                  <Text style={styles.coinToastText}>
                    {t('coinEarned', { amount: String(coinsEarned) })}
                  </Text>
                </View>
              </GlassCard>
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
          <Animated.View entering={FadeIn.delay(800)} style={styles.countdownFill}>
            <DailyCountdown />
          </Animated.View>
        </ScrollView>
        <View style={styles.hiddenCard}>
          <ShareCard
            ref={shareCardRef}
            questionText={question.question_text}
            optionA={question.option_a}
            optionB={question.option_b}
            percentA={percentA}
            percentB={percentB}
            userChoice={userChoice}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Active state - carousel with questions
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Split Second</Text>
        {globalStats && globalStats.today_votes > 0 && (
          <GlobalStatsBanner todayVotes={globalStats.today_votes} />
        )}
      </View>
      {/* Live event banner */}
      {liveEvent?.has_event && liveEvent.status && (
        <LiveEventBanner
          timeRemaining={liveTimeRemaining}
          status={liveEvent.status}
          onPress={() => liveEvent.status === 'active' && setShowLiveModal(true)}
        />
      )}
      <QuestionCarousel
        questions={carouselItems}
        onVote={handleVote}
        submitting={false}
        onRefresh={refetch}
      />
      {/* Live event modal */}
      {liveEvent?.has_event && liveEvent.status === 'active' && (
        <LiveEventModal
          visible={showLiveModal}
          optionA={liveEvent.option_a ?? ''}
          optionB={liveEvent.option_b ?? ''}
          countA={liveCountA}
          countB={liveCountB}
          timeRemaining={liveTimeRemaining}
          userChoice={liveUserChoice}
          coinsEarned={liveCoinsEarned}
          coinReward={liveEvent.coin_reward ?? 20}
          onVote={liveVote}
          onClose={() => setShowLiveModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

// Hook to expose submitVote for multiple questions with vote time tracking
function useMultiVote() {
  const questionShownAt = useRef<Record<string, number>>({});

  const markShown = useCallback((questionId: string) => {
    if (!questionShownAt.current[questionId]) {
      questionShownAt.current[questionId] = Date.now();
    }
  }, []);

  const submitVote = useCallback(async (questionId: string, choice: 'a' | 'b'): Promise<VoteResults | null> => {
    const { submitVote: doSubmit } = await import('../../lib/votes');
    const shownAt = questionShownAt.current[questionId];
    const elapsed = shownAt ? (Date.now() - shownAt) / 1000 : undefined;
    return doSubmit(questionId, choice, elapsed);
  }, []);

  return { submitVote, markShown };
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
    letterSpacing: 2,
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
  dayCompleteContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  dayCompleteText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  dayCompleteSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  progressBanner: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
