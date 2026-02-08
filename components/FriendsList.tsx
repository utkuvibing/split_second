import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { Friend, FREE_FRIEND_LIMIT, getFriendDisplayName } from '../lib/friends';
import { CompatibilityBadge } from './CompatibilityBadge';
import { t } from '../lib/i18n';

interface Props {
  friends: Friend[];
  isPremium: boolean;
  onRemove: (friendId: string) => void;
  onAddPress: () => void;
}

export function FriendsList({ friends, isPremium, onRemove, onAddPress }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const maxFriends = isPremium ? Infinity : FREE_FRIEND_LIMIT;
  const canAdd = friends.length < maxFriends;

  const handleRemove = (friend: Friend) => {
    Alert.alert(
      t('removeFriend'),
      t('removeFriendConfirm'),
      [
        { text: t('continue'), style: 'cancel' },
        { text: t('removeFriend'), style: 'destructive', onPress: () => onRemove(friend.friend_id) },
      ]
    );
  };

  if (friends.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
        <Text style={styles.emptyEmoji}>👋</Text>
        <Text style={styles.emptyText}>{t('noFriendsYet')}</Text>
        <Text style={styles.emptySubtext}>{t('noFriendsDesc')}</Text>
        <Pressable style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>{t('addFriend')}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {!isPremium && (
        <Text style={styles.limitText}>
          {t('friendLimit', { current: String(friends.length), max: String(FREE_FRIEND_LIMIT) })}
        </Text>
      )}
      {friends.map((friend) => (
        <Pressable
          key={friend.friend_id}
          style={styles.friendRow}
          onLongPress={() => handleRemove(friend)}
        >
          <View style={styles.friendInfo}>
            <Text style={styles.friendCode}>{getFriendDisplayName(friend.friend_code)}</Text>
            <CompatibilityBadge score={friend.compatibility} />
          </View>
        </Pressable>
      ))}
      {canAdd && (
        <Pressable style={styles.addRow} onPress={onAddPress}>
          <Text style={styles.addRowText}>+ {t('addFriend')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: 8,
  },
  limitText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  friendRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  friendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendCode: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  addRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  addRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});
