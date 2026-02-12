import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { t } from '../lib/i18n';
import { RADIUS } from '../constants/ui';
import { COIN_COSTS } from '../lib/coins';

interface Props {
  visible: boolean;
  remainingToday: number;
  userCoins: number;
  onClose: () => void;
  onSubmit: (optionA: string, optionB: string) => Promise<boolean>;
}

export function SubmitQuestionModal({ visible, remainingToday, userCoins, onClose, onSubmit }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cost = COIN_COSTS.submit_question;
  const hasEnoughCoins = userCoins >= cost;
  const isValid = optionA.trim().length >= 2 && optionB.trim().length >= 2;
  const canSubmit = isValid && hasEnoughCoins && remainingToday > 0;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);

    const ok = await onSubmit(optionA.trim(), optionB.trim());
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOptionA('');
        setOptionB('');
        onClose();
      }, 1200);
    } else {
      setError(t('communitySubmitError'));
    }
    setLoading(false);
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <Text style={styles.title}>{t('communitySubmitTitle')}</Text>
          <Text style={styles.remaining}>
            {t('communitySubmitRemaining', { count: String(remainingToday) })}
          </Text>
          <Text style={[styles.costLabel, !hasEnoughCoins && { color: colors.warning }]}>
            {hasEnoughCoins
              ? t('communitySubmitCost', { cost: String(cost) })
              : t('communityInsufficientCoins', { cost: String(cost) })}
          </Text>

          <TextInput
            style={styles.input}
            value={optionA}
            onChangeText={(text) => { setOptionA(text.slice(0, 100)); setError(null); }}
            placeholder={t('communityOptionA')}
            placeholderTextColor={colors.textMuted}
            maxLength={100}
            multiline
          />

          <Text style={styles.vsLabel}>{t('communityVs')}</Text>

          <TextInput
            style={styles.input}
            value={optionB}
            onChangeText={(text) => { setOptionB(text.slice(0, 100)); setError(null); }}
            placeholder={t('communityOptionB')}
            placeholderTextColor={colors.textMuted}
            maxLength={100}
            multiline
          />

          {error && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
              {error}
            </Animated.Text>
          )}

          {success && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.success}>
              {t('communitySubmitSuccess')}
            </Animated.Text>
          )}

          <Pressable
            style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}
          >
            <Text style={styles.submitText}>
              {loading ? '...' : `${t('communitySubmit')} (${cost} 🪙)`}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  remaining: {
    fontSize: 12,
    color: colors.textMuted,
  },
  costLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: RADIUS.md,
    padding: 14,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  vsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
  },
  error: {
    fontSize: 13,
    color: colors.warning,
    textAlign: 'center',
  },
  success: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
