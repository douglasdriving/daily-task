// Task-related types
export enum ImportanceLevel {
  VeryLow = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  Critical = 5,
}

export enum Duration {
  FifteenMin = 15,
  ThirtyMin = 30,
  OneHour = 60,
  TwoHours = 120,
  FourHours = 240,
  FullDay = 480,
}

export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
  Postponed = 'postponed',
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  importance: ImportanceLevel;
  deadline?: Date;
  startDate?: Date; // First date when this task can appear as daily
  estimatedDuration: Duration;
  createdAt: Date;
  completedAt?: Date;
  postponedUntil?: Date;
  postponeReason?: string;
  status: TaskStatus;
  order: number; // User-defined order for prioritization
}

// App state types
export type TimeAvailability = 'normal' | 'extra' | 'limited';

export type Theme = 'light' | 'dark';

export interface AppState {
  id: string; // Always 'state' for singleton
  lastDailyCheckDate?: Date;
  lastCompletionDate?: Date; // Track when last task was completed
  dailyTaskId?: string;
  notificationTime: string; // HH:mm format (e.g., "07:00")
  notificationsEnabled: boolean;
  theme: Theme;
  hasCompletedOnboarding: boolean;
  todayTimeAvailability?: TimeAvailability;
}

// Default app state
export const defaultAppState: AppState = {
  id: 'state',
  notificationTime: '07:00',
  notificationsEnabled: true,
  theme: 'light',
  hasCompletedOnboarding: false,
};

// Form types
export interface TaskFormData {
  name: string;
  description?: string;
  importance: ImportanceLevel;
  deadline?: Date;
  startDate?: Date;
  estimatedDuration: Duration;
}

// Postpone options
export interface PostponeOption {
  label: string;
  days: number;
}

export const POSTPONE_OPTIONS: PostponeOption[] = [
  { label: 'Tomorrow', days: 1 },
  { label: 'In a few days', days: 3 },
  { label: 'Next week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

// Helper type for task creation
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'status'>;

// Helper type for task updates
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>;
