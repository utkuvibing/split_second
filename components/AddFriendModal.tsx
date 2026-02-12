import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { AddFriendError } from '../lib/friends';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<{ success: boolean; error?: AddFriendError }>;
}

const ERROR_KEYS: Record<string, TranslationKey> = {
  not_found: 'addFriendError',
  self: 'addFriendSelf',
  already_friends: 'addFriendAlready',
  already_pending: 'alreadyPending',
  limit_reached: 'addFriendLimit',
};

export function AddFriendModal({ visible, onClose, onSubmit }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setError(null);

    const result = await onSubmit(code.toUpperCase());
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCode('');
        onClose();
      }, 1500);
    } else {
      const errKey = ERROR_KEYS[result.error ?? 'not_found'];
      setError(t(errKey));
    }
    setLoading(false);
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <Text style={styles.title}>{t('addFriendTitle')}</Text>

          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(text) => {
              setCode(text.toUpperCase().slice(0, 6));
              setError(null);
            }}
            placeholder={t('addFriendPlaceholder')}
            placeholderTextColor={colors.textMuted}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {error && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
              {error}
            </Animated.Text>
          )}

          {success && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.success}>
              {t('friendRequestSent')}
            </Animated.Text>
          )}

          <Pressable
            style={[styles.submitButton, code.length < 6 && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={code.length < 6 || loading}
          >
            <Text style={styles.submitText}>
              {loading ? '...' : t('addFriendSubmit')}
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
    width: '85%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    width: '100%',
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
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
  submitButton: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 12,
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
