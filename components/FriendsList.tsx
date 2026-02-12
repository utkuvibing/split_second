import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { Friend, FREE_FRIEND_LIMIT, getFriendDisplayName } from '../lib/friends';
import { CompatibilityBadge } from './CompatibilityBadge';
import { AvatarDisplay } from './AvatarDisplay';
import { GradientButton } from './ui/GradientButton';
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
        <Ionicons name="hand-left-outline" size={36} color={colors.textMuted} />
        <Text style={styles.emptyText}>{t('noFriendsYet')}</Text>
        <Text style={styles.emptySubtext}>{t('noFriendsDesc')}</Text>
        <GradientButton title={t('addFriend')} onPress={onAddPress} small />
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
            <View style={styles.friendLeft}>
              <AvatarDisplay avatarId={friend.friend_avatar_id ?? null} size={28} />
              <Text style={styles.friendCode}>{getFriendDisplayName(friend.friend_code, friend.friend_display_name)}</Text>
            </View>
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
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
});
