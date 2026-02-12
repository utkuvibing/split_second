import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from './i18n';

const NOTIFICATION_SCHEDULED_KEY = 'daily_notifications_v2_scheduled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: t('dailyReminderChannel'),
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  return true;
}

export async function scheduleDailyReminders() {
  const alreadyScheduled = await AsyncStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
  if (alreadyScheduled === 'true') return;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // Morning reminder at 08:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('morningReminderTitle'),
      body: t('morningReminderBody'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });

  // Afternoon reminder at 14:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('afternoonReminderTitle'),
      body: t('afternoonReminderBody'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 0,
    },
  });

  // Evening reminder at 20:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('eveningReminderTitle'),
      body: t('eveningReminderBody'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(NOTIFICATION_SCHEDULED_KEY, 'true');
}

// Keep backward compat name
export const scheduleDailyReminder = scheduleDailyReminders;

export async function scheduleStreakReminder(currentStreak: number) {
  if (currentStreak < 3) return;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('streakReminderTitle', { streak: currentStreak }),
      body: t('streakReminderBody'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    },
  });
}
