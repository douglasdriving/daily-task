import { differenceInDays, startOfDay, isSameDay } from 'date-fns';
import { Task, TimeAvailability, Duration } from '../types';

/**
 * Calculate priority score for a task based on multiple factors
 */
export function calculatePriorityScore(task: Task): number {
  let score = 0;

  // 1. Importance weight (0-40 points)
  // Critical=40, High=30, Medium=20, Low=10
  score += task.importance * 10;

  // 2. Deadline urgency (0-40 points)
  if (task.deadline) {
    const daysUntilDeadline = differenceInDays(task.deadline, new Date());

    if (daysUntilDeadline < 0) {
      // Overdue - maximum urgency
      score += 40;
    } else if (daysUntilDeadline === 0) {
      // Due today
      score += 35;
    } else if (daysUntilDeadline <= 3) {
      // Due in 3 days
      score += 30;
    } else if (daysUntilDeadline <= 7) {
      // Due this week
      score += 20;
    } else if (daysUntilDeadline <= 14) {
      // Due in 2 weeks
      score += 10;
    }
    // Beyond 2 weeks gets 0 points for deadline urgency
  }

  // 3. Age factor (0-20 points) - prevent task starvation
  // Tasks that have been waiting longer get a boost
  const daysInQueue = differenceInDays(new Date(), task.createdAt);
  score += Math.min(daysInQueue, 20);

  return score;
}

/**
 * Filter tasks by duration based on time availability
 */
export function filterTasksByDuration(
  tasks: Task[],
  timeAvailability: TimeAvailability
): Task[] {
  if (timeAvailability === 'extra') {
    // Prefer longer tasks (2+ hours)
    const longTasks = tasks.filter(t => t.estimatedDuration >= Duration.TwoHours);
    return longTasks.length > 0 ? longTasks : tasks;
  } else if (timeAvailability === 'limited') {
    // Prefer shorter tasks (≤1 hour)
    const shortTasks = tasks.filter(t => t.estimatedDuration <= Duration.OneHour);
    return shortTasks.length > 0 ? shortTasks : tasks;
  }

  // Normal - return all tasks
  return tasks;
}

/**
 * Select the best task to do today based on prioritization algorithm
 */
export function selectDailyTask(
  eligibleTasks: Task[],
  timeAvailability: TimeAvailability
): Task | null {
  if (eligibleTasks.length === 0) {
    return null;
  }

  // 1. Filter by duration based on time availability
  let filteredTasks = filterTasksByDuration(eligibleTasks, timeAvailability);

  if (filteredTasks.length === 0) {
    // Fallback to all eligible tasks if filtering resulted in empty list
    filteredTasks = eligibleTasks;
  }

  // 2. Calculate priority score for each task
  const scoredTasks = filteredTasks.map(task => ({
    task,
    score: calculatePriorityScore(task),
  }));

  // 3. Sort by score (highest first), then by duration (shortest first) for same score
  scoredTasks.sort((a, b) => {
    // Primary sort: by score (highest first)
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Secondary sort: by duration (shortest first) - "low hanging fruit"
    return a.task.estimatedDuration - b.task.estimatedDuration;
  });

  // 4. Return highest priority task
  return scoredTasks[0].task;
}

/**
 * Check if we need to show the time availability check today
 */
export function shouldShowTimeAvailabilityCheck(lastCheckDate?: Date): boolean {
  if (!lastCheckDate) {
    return true; // Never checked before
  }

  const today = startOfDay(new Date());
  const lastCheck = startOfDay(lastCheckDate);

  // Show if we haven't checked today
  return !isSameDay(today, lastCheck);
}

/**
 * Get tasks that are eligible for selection (not in cooldown)
 */
export function getEligibleTasksForToday(tasks: Task[]): Task[] {
  const now = new Date();

  return tasks.filter(task => {
    // Must be pending
    if (task.status !== 'pending') {
      return false;
    }

    // Check if task is in cooldown
    if (task.postponedUntil && task.postponedUntil > now) {
      return false;
    }

    return true;
  });
}

/**
 * Format duration for display
 */
export function formatDuration(duration: Duration): string {
  switch (duration) {
    case Duration.FifteenMin:
      return '15 minutes';
    case Duration.ThirtyMin:
      return '30 minutes';
    case Duration.OneHour:
      return '1 hour';
    case Duration.TwoHours:
      return '2 hours';
    case Duration.FourHours:
      return '4 hours';
    case Duration.FullDay:
      return 'Full day';
    default:
      return `${duration} minutes`;
  }
}

/**
 * Get importance label
 */
export function getImportanceLabel(importance: number): string {
  switch (importance) {
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    case 4:
      return 'Critical';
    default:
      return 'Unknown';
  }
}

/**
 * Get importance color class
 */
export function getImportanceColor(importance: number): string {
  switch (importance) {
    case 1:
      return 'bg-gray-500';
    case 2:
      return 'bg-blue-500';
    case 3:
      return 'bg-orange-500';
    case 4:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
