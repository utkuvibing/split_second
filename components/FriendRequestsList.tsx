import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { FriendRequest } from '../lib/friendRequests';
import { getFriendDisplayName } from '../lib/friends';
import { t } from '../lib/i18n';
import { RADIUS } from '../constants/ui';

interface Props {
  requests: FriendRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function FriendRequestsList({ requests, onAccept, onReject }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  if (requests.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.title}>{t('pendingRequests')}</Text>
      {requests.map((req) => {
        const name = getFriendDisplayName(req.from_friend_code, req.from_display_name);
        return (
          <View key={req.id} style={styles.requestRow}>
            <View style={styles.info}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.code}>{req.from_friend_code}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={() => onAccept(req.id)}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={() => onReject(req.id)}
              >
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  code: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: colors.success,
  },
  rejectBtn: {
    backgroundColor: colors.warning,
  },
});
