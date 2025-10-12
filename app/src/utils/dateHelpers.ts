import { format, formatDistanceToNow, isPast, isToday, addDays } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Format deadline with context
 */
export function formatDeadline(deadline: Date): string {
  if (isToday(deadline)) {
    return 'Due today';
  }

  if (isPast(deadline)) {
    return `Overdue by ${formatDistanceToNow(deadline)}`;
  }

  return `Due ${formatDistanceToNow(deadline, { addSuffix: true })}`;
}

/**
 * Get deadline color class based on urgency
 */
export function getDeadlineColor(deadline: Date): string {
  if (isPast(deadline)) {
    return 'text-red-600 dark:text-red-400';
  }

  if (isToday(deadline)) {
    return 'text-orange-600 dark:text-orange-400';
  }

  const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 3) {
    return 'text-orange-600 dark:text-orange-400';
  }

  if (daysUntil <= 7) {
    return 'text-yellow-600 dark:text-yellow-400';
  }

  return 'text-gray-600 dark:text-gray-400';
}

/**
 * Calculate postpone date
 */
export function calculatePostponeDate(days: number): Date {
  return addDays(new Date(), days);
}

/**
 * Check if a date is in the past
 */
export function isOverdue(deadline: Date): boolean {
  return isPast(deadline) && !isToday(deadline);
}
