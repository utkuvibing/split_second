import { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ViewToken } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { Question } from '../types/database';
import { isQuestionUnlocked } from '../lib/questions';
import { QuestionCard } from './QuestionCard';
import { LockedQuestionCard } from './LockedQuestionCard';
import { CountdownTimer } from './CountdownTimer';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { hapticVote } from '../lib/haptics';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW, GLASS } from '../constants/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIMER_SECONDS = 10;
const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

interface QuestionState {
  question: Question;
  hasVoted: boolean;
  isLocked: boolean;
  isSubmitting: boolean;
}

interface Props {
  questions: QuestionState[];
  onVote: (questionId: string, choice: 'a' | 'b') => void;
  onRefresh: () => void;
}

function PaginationDots({ items, activeIndex, colors }: {
  items: QuestionState[];
  activeIndex: number;
  colors: ThemeColors;
}) {
  return (
    <View style={dotStyles.container}>
      {items.map((item, i) => {
        let bg = colors.surface;
        if (item.hasVoted) {
          bg = colors.accent;
        } else if (!item.isLocked) {
          bg = i === activeIndex ? colors.text : colors.textMuted;
        }
        const isActive = i === activeIndex;
        return isActive ? (
          <LinearGradient
            key={i}
            colors={[colors.accent, colors.optionB]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[dotStyles.dot, dotStyles.dotActive]}
          />
        ) : (
          <View
            key={i}
            style={[
              dotStyles.dot,
              { backgroundColor: bg },
            ]}
          />
        );
      })}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
});

export function QuestionCarousel({ questions, onVote, onRefresh }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [activeIndex, setActiveIndex] = useState(() => {
    // Start at first unlocked, unvoted question
    const idx = questions.findIndex(q => !q.isLocked && !q.hasVoted);
    return idx >= 0 ? idx : 0;
  });
  const flatListRef = useRef<FlatList>(null);

  const activeQuestion = questions[activeIndex];

  // Keep carousel on the current unanswered question (initial load + after vote).
  useEffect(() => {
    const current = questions[activeIndex];
    const needsAdvance = !current || current.hasVoted || current.isLocked;
    if (!needsAdvance) return;

    const nextIdx = questions.findIndex((q) => !q.isLocked && !q.hasVoted);
    if (nextIdx < 0 || nextIdx === activeIndex) return;

    setActiveIndex(nextIdx);
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({ index: nextIdx, animated: true });
    });
  }, [questions, activeIndex]);

  const showTimer = Boolean(
    activeQuestion && !activeQuestion.isLocked && !activeQuestion.hasVoted
  );

  const tryVote = useCallback((questionId: string, choice: 'a' | 'b') => {
    const item = questions.find(q => q.question.id === questionId);
    if (!item || item.hasVoted || item.isLocked || item.isSubmitting) return;
    hapticVote();
    onVote(questionId, choice);
  }, [onVote, questions]);

  const handleVote = useCallback((questionId: string, choice: 'a' | 'b') => {
    tryVote(questionId, choice);
  }, [tryVote]);

  const handleTimerExpire = useCallback(() => {
    if (
      activeQuestion
      && !activeQuestion.hasVoted
      && !activeQuestion.isLocked
      && !activeQuestion.isSubmitting
    ) {
      const randomChoice = Math.random() < 0.5 ? 'a' : 'b';
      tryVote(activeQuestion.question.id, randomChoice as 'a' | 'b');
    }
  }, [activeQuestion, tryVote]);

  const { timeLeft, progress } = useCountdownTimer(
    TIMER_SECONDS,
    handleTimerExpire,
    showTimer,
    activeQuestion?.question.id
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const votedCount = questions.filter(q => q.hasVoted).length;
  const totalCount = questions.length;

  const renderItem = useCallback(({ item }: { item: QuestionState }) => {
    return (
      <View style={{ width: SCREEN_WIDTH }}>
        {item.isLocked ? (
          <LockedQuestionCard
            timeSlot={item.question.time_slot}
            onUnlock={onRefresh}
          />
        ) : (
          <QuestionCard
            question={item.question}
            onVote={(choice) => handleVote(item.question.id, choice)}
            disabled={item.hasVoted || item.isSubmitting}
          />
        )}
      </View>
    );
  }, [handleVote, onRefresh]);

  return (
    <View style={styles.container}>
      {showTimer && activeQuestion && (
        <CountdownTimer
          key={activeQuestion.question.id}
          timeLeft={timeLeft}
          progress={progress}
        />
      )}
      <PaginationDots items={questions} activeIndex={activeIndex} colors={colors} />
      <FlatList
        ref={flatListRef}
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.question.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        initialScrollIndex={activeIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
      <Animated.View entering={FadeIn.duration(300)} style={styles.progressBar}>
        <View style={[styles.progressPill, { backgroundColor: GLASS.backgroundColor(colors.surface), borderColor: GLASS.borderColor }]}>
          <Text style={styles.progressText}>
            {votedCount} / {totalCount}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
