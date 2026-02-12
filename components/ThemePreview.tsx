import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeColors } from '../types/premium';

interface Props {
  themeColors: ThemeColors;
  size?: number;
}

export function ThemePreview({ themeColors, size = 56 }: Props) {
  const swatchSize = size / 3;
  const radius = size / 4;
  return (
    <LinearGradient
      colors={[themeColors.accent + '20', themeColors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, {
        width: size,
        height: size,
        borderRadius: radius,
      }]}
    >
      <View style={[styles.surfaceBar, {
        backgroundColor: themeColors.surface,
        width: size * 0.75,
        height: size * 0.2,
        borderRadius: 3,
      }]} />
      <View style={styles.row}>
        <View style={[styles.swatch, {
          width: swatchSize,
          height: swatchSize * 0.6,
          backgroundColor: themeColors.optionA,
          borderRadius: 3,
        }]} />
        <View style={[styles.swatch, {
          width: swatchSize,
          height: swatchSize * 0.6,
          backgroundColor: themeColors.optionB,
          borderRadius: 3,
        }]} />
      </View>
      <View style={[styles.accentBar, {
        backgroundColor: themeColors.accent,
        width: size * 0.5,
      }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  surfaceBar: {},
  row: {
    flexDirection: 'row',
    gap: 3,
  },
  swatch: {},
  accentBar: {
    height: 3,
    borderRadius: 2,
  },
});
