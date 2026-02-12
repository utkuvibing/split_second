import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/themeContext';
import { ThemeColors } from '../../types/premium';
import { useCommunityQuestions } from '../../hooks/useCommunityQuestions';
import { useSubmitQuestion } from '../../hooks/useSubmitQuestion';
import { useCoins } from '../../hooks/useCoins';
import { CommunityQuestionCard } from '../../components/CommunityQuestionCard';
import { SubmitQuestionModal } from '../../components/SubmitQuestionModal';
import { GradientButton } from '../../components/ui/GradientButton';
import { SortMode } from '../../lib/communityQuestions';
import { RADIUS } from '../../constants/ui';
import { t } from '../../lib/i18n';

const SORT_OPTIONS: { key: SortMode; labelKey: string }[] = [
  { key: 'hot', labelKey: 'communityHot' },
  { key: 'new', labelKey: 'communityNew' },
  { key: 'top', labelKey: 'communityTop' },
];

export default function CommunityScreen() {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { questions, sort, loading, changeSort, vote, loadMore, refresh } = useCommunityQuestions();
  const { submit, loading: submitLoading } = useSubmitQuestion();
  const { coins, fetchCoins } = useCoins();
  const [submitVisible, setSubmitVisible] = useState(false);
  const [remainingToday, setRemainingToday] = useState(3);

  // Load on mount
  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (optionA: string, optionB: string) => {
    const ok = await submit(optionA, optionB);
    if (ok) {
      setRemainingToday((prev) => Math.max(0, prev - 1));
      refresh();
      fetchCoins();
    }
    return ok;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('communityTitle')}</Text>
        <GradientButton
          title={t('communitySubmitBtn')}
          onPress={() => setSubmitVisible(true)}
          small
        />
      </View>

      {/* Sort tabs */}
      <View style={styles.sortRow}>
        {SORT_OPTIONS.map(({ key, labelKey }) => (
          <Pressable
            key={key}
            style={[styles.sortTab, sort === key && styles.sortTabActive]}
            onPress={() => changeSort(key)}
          >
            <Text style={[
              styles.sortTabText,
              sort === key && { color: colors.accent },
            ]}>
              {t(labelKey as any)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunityQuestionCard question={item} onVote={vote} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 48 }} />
          ) : (
            <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>{t('communityEmpty')}</Text>
              <Text style={styles.emptySubtext}>{t('communityEmptyDesc')}</Text>
            </Animated.View>
          )
        }
      />

      <SubmitQuestionModal
        visible={submitVisible}
        remainingToday={remainingToday}
        userCoins={coins}
        onClose={() => setSubmitVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  sortTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: colors.surface,
  },
  sortTabActive: {
    backgroundColor: colors.accent + '20',
  },
  sortTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
