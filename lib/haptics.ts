import * as Haptics from 'expo-haptics';

export function hapticVote() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function hapticResult() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticTick() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
