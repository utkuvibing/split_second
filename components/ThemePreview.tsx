import { View, StyleSheet } from 'react-native';
import { ThemeColors } from '../types/premium';

interface Props {
  themeColors: ThemeColors;
  size?: number;
}

export function ThemePreview({ themeColors, size = 48 }: Props) {
  const swatchSize = size / 3.5;
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: themeColors.background, borderRadius: size / 4 }]}>
      <View style={styles.row}>
        <View style={[styles.swatch, { width: swatchSize, height: swatchSize, backgroundColor: themeColors.optionA }]} />
        <View style={[styles.swatch, { width: swatchSize, height: swatchSize, backgroundColor: themeColors.optionB }]} />
      </View>
      <View style={[styles.accentBar, { backgroundColor: themeColors.accent, width: size * 0.6 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  row: {
    flexDirection: 'row',
    gap: 3,
  },
  swatch: {
    borderRadius: 4,
  },
  accentBar: {
    height: 4,
    borderRadius: 2,
  },
});
