import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { FriendVote, getFriendDisplayName } from '../lib/friends';
import { AvatarDisplay } from './AvatarDisplay';
import { t } from '../lib/i18n';
import { RADIUS, SHADOW, GLASS } from '../constants/ui';

interface Props {
  friendVotes: FriendVote[];
  optionA: string;
  optionB: string;
  userChoice?: 'a' | 'b' | null;
}

export function FriendVotesFeed({ friendVotes, optionA, optionB, userChoice }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (friendVotes.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.delay(1400).duration(400)} style={styles.container}>
      <Text style={styles.title}>{t('friendVotesTitle')}</Text>
      <View style={styles.list}>
        {friendVotes.map((fv) => {
          const name = getFriendDisplayName(fv.friend_code, fv.friend_display_name);
          const choiceText = fv.choice === 'a' ? optionA : fv.choice === 'b' ? optionB : null;
          const sameChoice = userChoice && fv.choice === userChoice;
          const oppositeChoice = userChoice && fv.choice && fv.choice !== userChoice;

          return (
            <View key={fv.friend_id} style={styles.card}>
              <View style={styles.cardHeader}>
                <AvatarDisplay avatarId={fv.friend_avatar_id ?? null} size={24} />
                <View style={[
                  styles.choiceIndicator,
                  { backgroundColor: fv.choice === 'a' ? colors.optionA : fv.choice === 'b' ? colors.optionB : colors.textMuted },
                ]} />
                <Text style={styles.name}>{name}</Text>
              </View>
              {choiceText ? (
                <Text style={styles.choiceText} numberOfLines={2}>
                  {choiceText}
                </Text>
              ) : (
                <Text style={styles.notVoted}>
                  {t('friendNotVoted', { name: '' }).trim()}
                </Text>
              )}
              {sameChoice && (
                <View style={[styles.reactionBadge, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.reactionText, { color: colors.accent }]}>
                    {t('friendSameChoice')}
                  </Text>
                </View>
              )}
              {oppositeChoice && (
                <View style={[styles.reactionBadge, { backgroundColor: colors.warning + '20' }]}>
                  <Text style={[styles.reactionText, { color: colors.warning }]}>
                    {t('friendOppositeChoice')}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginHorizontal: 24,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: GLASS.backgroundColor(colors.surface),
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: GLASS.borderColor,
    ...SHADOW.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  choiceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  choiceText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    paddingLeft: 22,
  },
  reactionBadge: {
    alignSelf: 'flex-start',
    marginLeft: 22,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reactionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notVoted: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingLeft: 22,
  },
});
