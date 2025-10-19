/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Check if notifications are supported
 */
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Check if we have notification permission
 */
export function hasNotificationPermission(): boolean {
  if (!areNotificationsSupported()) {
    return false;
  }

  return Notification.permission === 'granted';
}

/**
 * Show a notification
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!hasNotificationPermission()) {
    console.warn('Cannot show notification: permission not granted');
    return;
  }

  try {
    new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

/**
 * Show daily task reminder notification
 */
export function showDailyTaskNotification(): void {
  showNotification('Daily Task', {
    body: 'Ready for today? Your task is waiting.',
    tag: 'daily-task',
    requireInteraction: false,
  });
}

/**
 * Show task completion celebration notification
 */
export function showCompletionNotification(): void {
  showNotification('Well Done!', {
    body: 'Task completed. See you tomorrow!',
    tag: 'task-complete',
    requireInteraction: false,
  });
}

/**
 * Schedule daily notification
 * Note: This is a simple implementation. For production, you'd want to use
 * service worker notifications for better reliability
 */
export function scheduleDailyNotification(time: string, callback: () => void): () => void {
  const [hours, minutes] = time.split(':').map(Number);

  function scheduleNext() {
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      callback();
      scheduleNext(); // Reschedule for next day
    }, delay);

    return timeoutId;
  }

  const timeoutId = scheduleNext();

  // Return cleanup function
  return () => clearTimeout(timeoutId);
}
