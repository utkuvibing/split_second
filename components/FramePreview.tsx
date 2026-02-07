import { View, StyleSheet } from 'react-native';

interface Props {
  borderColors: string[];
  size?: number;
}

export function FramePreview({ borderColors, size = 48 }: Props) {
  if (borderColors.length === 0) {
    // Default "no frame" - simple gray circle
    return (
      <View style={[styles.circle, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',
      }]}>
        <View style={[styles.innerCircle, {
          width: size - 8,
          height: size - 8,
          borderRadius: (size - 8) / 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }]} />
      </View>
    );
  }

  const borderWidth = Math.max(3, size / 12);
  const color1 = borderColors[0] ?? '#FFD700';
  const color2 = borderColors[1] ?? color1;

  // Simulate gradient with two half-circles layered
  return (
    <View style={[styles.circle, {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color1,
    }]}>
      {/* Second color on bottom-right half */}
      <View style={[styles.halfOverlay, {
        width: size,
        height: size / 2,
        bottom: 0,
        backgroundColor: color2,
        borderBottomLeftRadius: size / 2,
        borderBottomRightRadius: size / 2,
      }]} />
      {/* Inner circle (transparent center) */}
      <View style={[styles.innerCircle, {
        width: size - borderWidth * 2,
        height: size - borderWidth * 2,
        borderRadius: (size - borderWidth * 2) / 2,
        backgroundColor: '#1A1926',
      }]}>
        <View style={[styles.avatar, {
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: size * 0.2,
          backgroundColor: 'rgba(255,255,255,0.15)',
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  halfOverlay: {
    position: 'absolute',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatar: {},
});
