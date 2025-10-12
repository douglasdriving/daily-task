import Dexie, { Table } from 'dexie';
import { Task, AppState, defaultAppState, TaskStatus } from '../types';

// Define the database class
export class DailyTaskDatabase extends Dexie {
  tasks!: Table<Task, string>;
  appState!: Table<AppState, string>;

  constructor() {
    super('DailyTaskDB');

    // Define schema version 1
    this.version(1).stores({
      tasks: 'id, status, deadline, createdAt, postponedUntil, importance',
      appState: 'id',
    });
  }
}

// Create and export database instance
export const db = new DailyTaskDatabase();

// Initialize database with default app state if needed
export async function initializeDatabase() {
  try {
    const existingState = await db.appState.get('state');
    if (!existingState) {
      await db.appState.add(defaultAppState);
      console.log('Database initialized with default state');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Task CRUD operations
export async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task> {
  const newTask: Task = {
    ...taskData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: TaskStatus.Pending,
  };

  await db.tasks.add(newTask);
  return newTask;
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  return await db.tasks.get(id);
}

export async function getAllTasks(): Promise<Task[]> {
  return await db.tasks.toArray();
}

export async function getPendingTasks(): Promise<Task[]> {
  return await db.tasks
    .where('status')
    .equals('pending')
    .toArray();
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await db.tasks.update(id, updates);
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id);
}

// App state operations
export async function getAppState(): Promise<AppState> {
  const state = await db.appState.get('state');
  return state || defaultAppState;
}

export async function updateAppState(updates: Partial<AppState>): Promise<void> {
  await db.appState.update('state', updates);
}

// Task queries with filters
export async function getEligibleTasks(now: Date = new Date()): Promise<Task[]> {
  const tasks = await db.tasks
    .where('status')
    .equals('pending')
    .toArray();

  // Filter out tasks that are still in cooldown
  return tasks.filter(task => {
    if (!task.postponedUntil) return true;
    return task.postponedUntil <= now;
  });
}

export async function getTasksByStatus(status: string): Promise<Task[]> {
  return await db.tasks
    .where('status')
    .equals(status)
    .toArray();
}

export async function getOverdueTasks(now: Date = new Date()): Promise<Task[]> {
  const tasks = await getPendingTasks();

  return tasks.filter(task => {
    if (!task.deadline) return false;
    return task.deadline < now;
  });
}

// Bulk operations
export async function clearAllTasks(): Promise<void> {
  await db.tasks.clear();
}

export async function resetDatabase(): Promise<void> {
  await db.tasks.clear();
  await db.appState.clear();
  await db.appState.add(defaultAppState);
}

// Export data
export async function exportData(): Promise<string> {
  const tasks = await getAllTasks();
  const appState = await getAppState();

  const data = {
    tasks,
    appState,
    exportedAt: new Date().toISOString(),
    version: 1,
  };

  return JSON.stringify(data, null, 2);
}

// Import data
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);

    if (!data.tasks || !data.appState) {
      throw new Error('Invalid data format');
    }

    // Clear existing data
    await db.tasks.clear();

    // Import tasks (convert date strings back to Date objects)
    const tasks = data.tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      deadline: task.deadline ? new Date(task.deadline) : undefined,
      postponedUntil: task.postponedUntil ? new Date(task.postponedUntil) : undefined,
    }));

    await db.tasks.bulkAdd(tasks);

    // Import app state
    const appState = {
      ...data.appState,
      lastDailyCheckDate: data.appState.lastDailyCheckDate
        ? new Date(data.appState.lastDailyCheckDate)
        : undefined,
    };

    await db.appState.put(appState);

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
