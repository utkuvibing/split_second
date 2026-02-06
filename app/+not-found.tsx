import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page not found</Text>
      <Link href="/" style={styles.link}>
        Go back
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 20,
    color: Colors.text,
  },
  link: {
    fontSize: 16,
    color: Colors.accent,
  },
});
