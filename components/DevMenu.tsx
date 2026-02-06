import { useState, useEffect } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../lib/themeContext';
import {
  getDevPremium,
  setDevPremium,
  getDevOwnAll,
  setDevOwnAll,
  resetDevPremium,
} from '../lib/premium';
import { t } from '../lib/i18n';
import { ThemeColors } from '../types/premium';

interface Props {
  onPremiumChange?: () => void;
}

export function DevMenu({ onPremiumChange }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [premium, setPremium] = useState(false);
  const [ownAll, setOwnAll] = useState(false);

  useEffect(() => {
    getDevPremium().then(setPremium);
    getDevOwnAll().then(setOwnAll);
  }, []);

  const togglePremium = async (value: boolean) => {
    await setDevPremium(value);
    setPremium(value);
    onPremiumChange?.();
  };

  const toggleOwnAll = async (value: boolean) => {
    await setDevOwnAll(value);
    setOwnAll(value);
  };

  const handleReset = async () => {
    await resetDevPremium();
    setPremium(false);
    setOwnAll(false);
    onPremiumChange?.();
  };

  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('devMenu')}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>{t('devSimulatePremium')}</Text>
        <Switch
          value={premium}
          onValueChange={togglePremium}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('devOwnAllCosmetics')}</Text>
        <Switch
          value={ownAll}
          onValueChange={toggleOwnAll}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>

      <Pressable style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>{t('devReset')}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.warning,
      borderStyle: 'dashed',
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.warning,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      color: colors.text,
    },
    resetButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: 'center',
    },
    resetText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
    },
  });
