import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { TimeSlot } from '../types/database';
import { useCountdownToUnlock } from '../hooks/useCountdownToUnlock';
import { getUnlockHour } from '../lib/questions';
import { RADIUS, SHADOW } from '../constants/ui';
import { GlassCard } from './ui/GlassCard';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { t } from '../lib/i18n';

interface Props {
  timeSlot: TimeSlot;
  onUnlock?: () => void;
}

export function LockedQuestionCard({ timeSlot, onUnlock }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const { formatted, isUnlocked } = useCountdownToUnlock(timeSlot);
  const unlockHour = getUnlockHour(timeSlot);

  if (isUnlocked && onUnlock) {
    onUnlock();
  }

  const unlockTimeStr = `${String(unlockHour).padStart(2, '0')}:00`;

  return (
    <View style={styles.container}>
      <GlassCard style={SHADOW.md}>
        <View style={styles.card}>
          <AnimatedIcon name="lock-closed" size={48} color={colors.textMuted} animation="pulse" />
          <Text style={styles.unlockText}>
            {t('questionUnlocksAt', { time: unlockTimeStr })}
          </Text>
          <Text style={styles.countdown}>{formatted}</Text>
        </View>
      </GlassCard>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  unlockText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
