import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t } from '../lib/i18n';

interface Props {
  friendCode: string;
}

export function FriendCodeCard({ friendCode }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(friendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Split Second - ${t('friendCode')}: ${friendCode}`,
      });
    } catch {
      // User cancelled
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
      <Text style={styles.label}>{t('friendCode')}</Text>
      <Pressable onPress={handleCopy} style={styles.codeRow}>
        <Text style={styles.code}>{friendCode}</Text>
        {copied && (
          <Animated.Text entering={FadeIn.duration(200)} style={styles.copiedText}>
            {t('friendCodeCopied')}
          </Animated.Text>
        )}
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleCopy}>
          <Text style={styles.actionText}>📋</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, { backgroundColor: colors.accent }]} onPress={handleShare}>
          <Text style={styles.actionText}>{t('friendCodeShare')}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  code: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 4,
  },
  copiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
