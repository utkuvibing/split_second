import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { FriendVote, getFriendDisplayName } from '../lib/friends';
import { t } from '../lib/i18n';

interface Props {
  friendVotes: FriendVote[];
  optionA: string;
  optionB: string;
}

export function FriendVotesFeed({ friendVotes, optionA, optionB }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (friendVotes.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.delay(1400).duration(400)} style={styles.container}>
      <Text style={styles.title}>{t('friendVotesTitle')}</Text>
      <View style={styles.list}>
        {friendVotes.map((fv) => {
          const name = getFriendDisplayName(fv.friend_code);
          const choiceText = fv.choice === 'a' ? optionA : fv.choice === 'b' ? optionB : null;

          return (
            <View key={fv.friend_id} style={styles.row}>
              <View style={[
                styles.choiceIndicator,
                { backgroundColor: fv.choice === 'a' ? colors.optionA : fv.choice === 'b' ? colors.optionB : colors.textMuted },
              ]} />
              <Text style={styles.name}>{name}</Text>
              {choiceText ? (
                <Text style={styles.choice} numberOfLines={1}>
                  {choiceText}
                </Text>
              ) : (
                <Text style={styles.notVoted}>
                  {t('friendNotVoted', { name: '' }).trim()}
                </Text>
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.background,
  },
  choiceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  choice: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
  },
  notVoted: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    fontStyle: 'italic',
  },
});
