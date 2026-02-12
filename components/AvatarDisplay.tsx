import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { getFrameById } from '../lib/cosmetics';
import { getAvatarById } from '../lib/avatars';

interface Props {
  avatarId: string | null;
  size: number;
  frameId?: string;
}

const BORDER_WIDTH = 4;

export function AvatarDisplay({ avatarId, size, frameId }: Props) {
  const colors = useTheme();
  const avatar = getAvatarById(avatarId);
  const frame = frameId ? getFrameById(frameId) : null;
  const hasFrame = frame ? frame.borderColors.length > 0 : false;

  const innerSize = hasFrame ? size - BORDER_WIDTH * 2 : size;
  const emojiSize = Math.round(innerSize * 0.55);
  const iconSize = Math.round(innerSize * 0.4);

  const content = avatar ? (
    <Text style={{ fontSize: emojiSize, lineHeight: emojiSize * 1.15 }}>{avatar.emoji}</Text>
  ) : (
    <Ionicons name="person" size={iconSize} color={colors.textMuted} />
  );

  if (hasFrame && frame) {
    return (
      <View style={[styles.frameOuter, {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: frame.borderColors[0],
      }]}>
        <View style={[styles.frameHalf, {
          width: size,
          height: size / 2,
          bottom: 0,
          backgroundColor: frame.borderColors[1] ?? frame.borderColors[0],
          borderBottomLeftRadius: size / 2,
          borderBottomRightRadius: size / 2,
        }]} />
        <View style={[styles.inner, {
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.background,
        }]}>
          {content}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.noFrame, {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderColor: colors.textMuted,
      backgroundColor: colors.surface,
    }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  frameOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frameHalf: {
    position: 'absolute',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  noFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
