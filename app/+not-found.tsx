import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';

export default function NotFound() {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page not found</Text>
      <Link href="/" style={styles.link}>
        Go back
      </Link>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 20,
    color: colors.text,
  },
  link: {
    fontSize: 16,
    color: colors.accent,
  },
});
