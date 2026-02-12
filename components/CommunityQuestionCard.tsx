import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { CommunityQuestion, CommunityVoteType } from '../lib/communityQuestions';
import { getFriendDisplayName } from '../lib/friends';
import { RADIUS, SHADOW } from '../constants/ui';
import { t } from '../lib/i18n';

interface Props {
  question: CommunityQuestion;
  onVote: (id: string, type: CommunityVoteType) => void;
}

export function CommunityQuestionCard({ question, onVote }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const authorName = getFriendDisplayName(
    question.author_friend_code,
    question.author_display_name
  );
  const score = question.upvotes - question.downvotes;

  return (
    <View style={styles.card}>
      <Text style={styles.vs}>{t('communityVs')}</Text>
      <View style={styles.optionsRow}>
        <View style={[styles.option, { backgroundColor: colors.optionA + '20' }]}>
          <Text style={[styles.optionText, { color: colors.optionA }]}>
            {question.option_a}
          </Text>
        </View>
        <View style={[styles.option, { backgroundColor: colors.optionB + '20' }]}>
          <Text style={[styles.optionText, { color: colors.optionB }]}>
            {question.option_b}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.author}>{authorName}</Text>
        <View style={styles.voteRow}>
          <Pressable
            style={[styles.voteBtn, question.user_vote === 'up' && styles.voteBtnActive]}
            onPress={() => onVote(question.id, 'up')}
          >
            <Ionicons
              name={question.user_vote === 'up' ? 'arrow-up' : 'arrow-up-outline'}
              size={18}
              color={question.user_vote === 'up' ? colors.accent : colors.textMuted}
            />
          </Pressable>
          <Text style={[styles.score, score > 0 && { color: colors.accent }]}>
            {score}
          </Text>
          <Pressable
            style={[styles.voteBtn, question.user_vote === 'down' && styles.voteBtnActive]}
            onPress={() => onVote(question.id, 'down')}
          >
            <Ionicons
              name={question.user_vote === 'down' ? 'arrow-down' : 'arrow-down-outline'}
              size={18}
              color={question.user_vote === 'down' ? colors.warning : colors.textMuted}
            />
          </Pressable>
          <Pressable
            style={styles.reportBtn}
            onPress={() => onVote(question.id, 'report')}
          >
            <Ionicons name="flag-outline" size={14} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 12,
    ...SHADOW.sm,
  },
  vs: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  optionsRow: {
    gap: 8,
  },
  option: {
    borderRadius: RADIUS.md,
    padding: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: colors.textMuted,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voteBtn: {
    padding: 6,
    borderRadius: 8,
  },
  voteBtnActive: {
    backgroundColor: colors.background,
  },
  score: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  reportBtn: {
    padding: 6,
    marginLeft: 8,
  },
});
