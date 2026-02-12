import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { setDisplayName } from '../lib/nickname';
import { COIN_COSTS } from '../lib/coins';
import { t } from '../lib/i18n';

interface Props {
  visible: boolean;
  currentName: string | null;
  coins: number;
  onClose: () => void;
  onSaved: (name: string) => void;
}

export function NicknameEditModal({ visible, currentName, coins, onClose, onSaved }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [name, setName] = useState(currentName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isChange = currentName !== null;
  const cost = isChange ? COIN_COSTS.change_nickname : 0;
  const canAfford = !isChange || coins >= cost;
  const isValid = name.trim().length >= 2 && name.trim().length <= 16;

  const handleSave = async () => {
    if (!isValid || loading || !canAfford) return;
    setLoading(true);
    setError(null);

    const result = await setDisplayName(name.trim(), isChange);
    if (result.success) {
      setSuccess(true);
      onSaved(result.display_name ?? name.trim());
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } else if (result.error === 'insufficient_coins') {
      setError(t('nicknameInsufficientCoins'));
    } else {
      setError(result.error === 'server_error' ? t('nicknameServerError') : t('editNicknameError'));
    }
    setLoading(false);
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setName(currentName ?? '');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <Text style={styles.title}>{t('editNickname')}</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text.slice(0, 16));
              setError(null);
            }}
            placeholder={t('nicknamePlaceholder')}
            placeholderTextColor={colors.textMuted}
            maxLength={16}
            autoCorrect={false}
            autoFocus
          />

          <Text style={styles.charCount}>
            {name.trim().length}/16
          </Text>

          {isChange && (
            <Text style={[styles.costText, !canAfford && { color: colors.warning }]}>
              {t('nicknameCost', { cost: String(cost) })}
            </Text>
          )}

          {error && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
              {error}
            </Animated.Text>
          )}

          {success && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.success}>
              {t('nicknameSaved')}
            </Animated.Text>
          )}

          <Pressable
            style={[styles.saveButton, (!isValid || !canAfford) && styles.saveDisabled]}
            onPress={handleSave}
            disabled={!isValid || loading || !canAfford}
          >
            <Text style={styles.saveText}>
              {loading ? '...' : isChange ? t('nicknameSaveWithCost', { cost: String(cost) }) : t('save')}
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
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  costText: {
    fontSize: 13,
    color: colors.textMuted,
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
  saveButton: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
