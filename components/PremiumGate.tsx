import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import { t } from '../lib/i18n';

interface Props {
  isPremium: boolean;
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgrade?: () => void;
}

export function PremiumGate({ isPremium, feature, children, fallback, onUpgrade }: Props) {
  const colors = useTheme();

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={styles.lockEmoji}>🔒</Text>
      <Text style={[styles.title, { color: colors.text }]}>{t('premiumFeature')}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('premiumUnlock')}</Text>
      {onUpgrade && (
        <Pressable
          style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
          onPress={onUpgrade}
        >
          <Text style={[styles.upgradeText, { color: colors.text }]}>{t('premiumUpgrade')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  lockEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  upgradeButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
