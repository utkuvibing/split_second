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

export function hapticButton() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticError() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function hapticStreak(streak: number) {
  if (streak >= 30) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
  } else if (streak >= 7) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 120);
  } else if (streak >= 3) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}
