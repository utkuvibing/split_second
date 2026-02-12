import { useRef, useState, useCallback } from 'react';
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

interface QuestionState {
  question: Question;
  hasVoted: boolean;
  isLocked: boolean;
}

interface Props {
  questions: QuestionState[];
  onVote: (questionId: string, choice: 'a' | 'b') => void;
  submitting: boolean;
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

export function QuestionCarousel({ questions, onVote, submitting, onRefresh }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [activeIndex, setActiveIndex] = useState(() => {
    // Start at first unlocked, unvoted question
    const idx = questions.findIndex(q => !q.isLocked && !q.hasVoted);
    return idx >= 0 ? idx : 0;
  });
  const flatListRef = useRef<FlatList>(null);

  const activeQuestion = questions[activeIndex];
  const showTimer = activeQuestion && !activeQuestion.isLocked && !activeQuestion.hasVoted;

  const handleVote = useCallback((questionId: string, choice: 'a' | 'b') => {
    hapticVote();
    onVote(questionId, choice);
  }, [onVote]);

  const handleTimerExpire = useCallback(() => {
    if (activeQuestion && !activeQuestion.hasVoted && !activeQuestion.isLocked) {
      const randomChoice = Math.random() < 0.5 ? 'a' : 'b';
      hapticVote();
      onVote(activeQuestion.question.id, randomChoice as 'a' | 'b');
    }
  }, [activeQuestion, onVote]);

  const { timeLeft, progress } = useCountdownTimer(
    TIMER_SECONDS,
    handleTimerExpire,
    !!showTimer
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

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
            disabled={submitting || item.hasVoted}
          />
        )}
      </View>
    );
  }, [submitting, handleVote, onRefresh]);

  return (
    <View style={styles.container}>
      {showTimer && (
        <CountdownTimer timeLeft={timeLeft} progress={progress} />
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
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={activeIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
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
