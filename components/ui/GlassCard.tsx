import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { RADIUS, SHADOW, GLASS } from '../../constants/ui';
import { useTheme } from '../../lib/themeContext';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  noBlur?: boolean;
}

export function GlassCard({ children, style, intensity, noBlur }: Props) {
  const colors = useTheme();
  const blurIntensity = intensity ?? GLASS.intensity;
  const useBlur = !noBlur && Platform.OS === 'ios';

  if (useBlur) {
    return (
      <View style={[styles.outer, SHADOW.md, style]}>
        <BlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
          <View style={[styles.inner, { backgroundColor: GLASS.backgroundColor(colors.surface) }]}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.outer,
        SHADOW.md,
        { backgroundColor: GLASS.backgroundColor(colors.surface) },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: GLASS.borderColor,
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
  },
  inner: {
    padding: 0,
  },
});
