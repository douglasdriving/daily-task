import { create } from 'zustand';
import { Task, AppState, TimeAvailability, TaskStatus, CreateTaskInput } from '../types';
import {
  db,
  initializeDatabase,
  createTask as dbCreateTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  getAllTasks,
  getAppState,
  updateAppState as dbUpdateAppState,
  getEligibleTasks,
  getTaskById,
  moveTaskUp as dbMoveTaskUp,
  moveTaskDown as dbMoveTaskDown,
} from '../db';
import {
  selectDailyTask,
  shouldShowTimeAvailabilityCheck,
  getEligibleTasksForToday,
} from '../utils/prioritization';
import { startOfDay, addDays, isSameDay } from 'date-fns';

interface TaskStore {
  // State
  tasks: Task[];
  dailyTask: Task | null;
  appState: AppState | null;
  isLoading: boolean;
  showTimeCheck: boolean;
  showPreviousDayCheck: boolean;
  previousDayTask: Task | null;

  // Actions
  initialize: () => Promise<void>;
  loadTasks: () => Promise<void>;

  // Task management
  addTask: (taskData: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskUp: (id: string) => Promise<void>;
  moveTaskDown: (id: string) => Promise<void>;

  // Daily task flow
  checkDailyTask: (availability: TimeAvailability) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  postponeTask: (id: string, days: number, reason?: string) => Promise<void>;
  handlePreviousDayTaskCompleted: () => Promise<void>;
  handlePreviousDayTaskNotCompleted: () => Promise<void>;

  // App state
  updateSettings: (updates: Partial<AppState>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Helpers
  refreshDailyTask: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  dailyTask: null,
  appState: null,
  isLoading: true,
  showTimeCheck: false,
  showPreviousDayCheck: false,
  previousDayTask: null,

  // Initialize the store and database
  initialize: async () => {
    try {
      await initializeDatabase();
      const appState = await getAppState();
      const tasks = await getAllTasks();

      const today = startOfDay(new Date());
      const yesterday = addDays(today, -1);

      // Check if we've completed a task today
      const hasCompletedToday = appState.lastCompletionDate &&
        startOfDay(appState.lastCompletionDate).getTime() === today.getTime();

      // Check if there was a dailyTask from yesterday that wasn't completed
      let previousDayTask: Task | null = null;
      let showPreviousDayCheck = false;

      if (!hasCompletedToday && appState.dailyTaskId) {
        const lastCheckDate = appState.lastDailyCheckDate ? startOfDay(appState.lastDailyCheckDate) : null;

        // If last check was yesterday and we have a daily task ID, check if it's still pending
        if (lastCheckDate && lastCheckDate.getTime() === yesterday.getTime()) {
          const yesterdayTask = await getTaskById(appState.dailyTaskId);
          if (yesterdayTask && yesterdayTask.status === 'pending') {
            previousDayTask = yesterdayTask;
            showPreviousDayCheck = true;
          }
        }
      }

      // Check if we need to show time availability check (only if haven't completed today and no previous day check)
      const showTimeCheck = !hasCompletedToday && !showPreviousDayCheck &&
        shouldShowTimeAvailabilityCheck(appState.lastDailyCheckDate);

      let dailyTask: Task | null = null;

      // Load existing daily task if we don't need time check and haven't completed today
      if (!showTimeCheck && !hasCompletedToday && !showPreviousDayCheck && appState.dailyTaskId) {
        dailyTask = await getTaskById(appState.dailyTaskId) || null;
      }

      set({
        tasks,
        appState,
        dailyTask,
        showTimeCheck,
        showPreviousDayCheck,
        previousDayTask,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error initializing store:', error);
      set({ isLoading: false });
    }
  },

  // Load all tasks
  loadTasks: async () => {
    try {
      const tasks = await getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  },

  // Add a new task
  addTask: async (taskData: CreateTaskInput) => {
    try {
      const newTask = await dbCreateTask(taskData);
      const tasks = await getAllTasks();

      set({ tasks });

      // DON'T set as today's task if we've already completed one today
      const state = get();
      const today = startOfDay(new Date());
      const hasCompletedToday = state.appState?.lastCompletionDate &&
        startOfDay(state.appState.lastCompletionDate).getTime() === today.getTime();

      // Only set as daily task if: no current task, has time availability, and hasn't completed today
      if (!state.dailyTask && state.appState?.todayTimeAvailability && !hasCompletedToday) {
        await get().refreshDailyTask();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      await dbUpdateTask(id, updates);
      const tasks = await getAllTasks();

      set({ tasks });

      // If we updated the current daily task, refresh it
      const state = get();
      if (state.dailyTask?.id === id) {
        const updatedTask = await getTaskById(id);
        set({ dailyTask: updatedTask || null });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id: string) => {
    try {
      await dbDeleteTask(id);
      const tasks = await getAllTasks();

      set({ tasks });

      // If we deleted the current daily task, clear it
      const state = get();
      if (state.dailyTask?.id === id) {
        await dbUpdateAppState({ dailyTaskId: undefined });
        set({ dailyTask: null });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Move task up in priority
  moveTaskUp: async (id: string) => {
    try {
      await dbMoveTaskUp(id);
      const tasks = await getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error('Error moving task up:', error);
      throw error;
    }
  },

  // Move task down in priority
  moveTaskDown: async (id: string) => {
    try {
      await dbMoveTaskDown(id);
      const tasks = await getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error('Error moving task down:', error);
      throw error;
    }
  },

  // Check daily task with time availability
  checkDailyTask: async (availability: TimeAvailability) => {
    try {
      const today = startOfDay(new Date());

      // Get eligible tasks
      const allTasks = await getAllTasks();
      const eligibleTasks = getEligibleTasksForToday(allTasks);

      // Select daily task
      const selectedTask = selectDailyTask(eligibleTasks, availability);

      // Update app state
      await dbUpdateAppState({
        lastDailyCheckDate: today,
        dailyTaskId: selectedTask?.id,
        todayTimeAvailability: availability,
      });

      const appState = await getAppState();

      set({
        dailyTask: selectedTask,
        appState,
        showTimeCheck: false,
      });
    } catch (error) {
      console.error('Error checking daily task:', error);
      throw error;
    }
  },

  // Complete a task
  completeTask: async (id: string) => {
    try {
      const today = startOfDay(new Date());

      // Update task status
      await dbUpdateTask(id, {
        status: TaskStatus.Completed,
        completedAt: new Date(),
      });

      // Clear daily task and record completion date
      await dbUpdateAppState({
        dailyTaskId: undefined,
        lastCompletionDate: today,
      });

      // Reload tasks
      const tasks = await getAllTasks();
      const appState = await getAppState();

      set({
        tasks,
        dailyTask: null,
        appState,
      });
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Postpone a task
  postponeTask: async (id: string, days: number, reason?: string) => {
    try {
      // Calculate cooldown end date
      const cooldownEnd = addDays(new Date(), days);

      // Update task
      await dbUpdateTask(id, {
        status: TaskStatus.Postponed,
        postponedUntil: cooldownEnd,
        postponeReason: reason,
      });

      // Clear current daily task
      await dbUpdateAppState({ dailyTaskId: undefined });

      // Select a new task for today
      const state = get();
      const allTasks = await getAllTasks();
      const eligibleTasks = getEligibleTasksForToday(allTasks);

      const newTask = selectDailyTask(
        eligibleTasks,
        state.appState?.todayTimeAvailability || 'normal'
      );

      if (newTask) {
        await dbUpdateAppState({ dailyTaskId: newTask.id });
      }

      // Reload state
      const tasks = await getAllTasks();
      const appState = await getAppState();

      set({
        tasks,
        dailyTask: newTask,
        appState,
      });
    } catch (error) {
      console.error('Error postponing task:', error);
      throw error;
    }
  },

  // Update app settings
  updateSettings: async (updates: Partial<AppState>) => {
    try {
      await dbUpdateAppState(updates);
      const appState = await getAppState();
      set({ appState });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Set theme
  setTheme: async (theme: 'light' | 'dark') => {
    try {
      await dbUpdateAppState({ theme });

      // Update HTML class for dark mode
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const appState = await getAppState();
      set({ appState });
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async () => {
    try {
      await dbUpdateAppState({ hasCompletedOnboarding: true });
      const appState = await getAppState();
      set({ appState });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  // Refresh daily task (useful when tasks are added/changed)
  refreshDailyTask: async () => {
    try {
      const state = get();

      if (!state.appState?.todayTimeAvailability) {
        return; // Can't refresh without time availability
      }

      const allTasks = await getAllTasks();
      const eligibleTasks = getEligibleTasksForToday(allTasks);

      const newTask = selectDailyTask(
        eligibleTasks,
        state.appState.todayTimeAvailability
      );

      if (newTask) {
        await dbUpdateAppState({ dailyTaskId: newTask.id });
        set({ dailyTask: newTask });
      }
    } catch (error) {
      console.error('Error refreshing daily task:', error);
    }
  },

  // Handle when user says they completed yesterday's task
  handlePreviousDayTaskCompleted: async () => {
    try {
      const state = get();
      if (!state.previousDayTask) return;

      const today = startOfDay(new Date());

      // Mark the task as completed
      await dbUpdateTask(state.previousDayTask.id, {
        status: TaskStatus.Completed,
        completedAt: new Date(),
      });

      // Record completion date as yesterday (when it was actually done)
      const yesterday = addDays(today, -1);
      await dbUpdateAppState({
        lastCompletionDate: yesterday,
        dailyTaskId: undefined,
      });

      // Now show time check for today
      set({
        showPreviousDayCheck: false,
        previousDayTask: null,
        showTimeCheck: true,
      });

      // Reload tasks
      const tasks = await getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error('Error handling previous day task completion:', error);
    }
  },

  // Handle when user says they didn't complete yesterday's task
  handlePreviousDayTaskNotCompleted: async () => {
    try {
      // Just proceed with normal flow (show time check)
      set({
        showPreviousDayCheck: false,
        previousDayTask: null,
        showTimeCheck: true,
      });
    } catch (error) {
      console.error('Error handling previous day task not completed:', error);
    }
  },
}));
