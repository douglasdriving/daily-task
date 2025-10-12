# Daily Task App - Technical Specification

## Technology Stack

### Core Framework: **React + TypeScript**
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server

### Styling: **Tailwind CSS**
- Utility-first CSS framework
- Easy responsive design
- Built-in dark mode support
- Small bundle size with purging

### State Management: **Zustand**
- Lightweight state management (3kb)
- Simple API with hooks
- No boilerplate
- Perfect for local-first apps

### Local Storage: **IndexedDB (via Dexie.js)**
- Structured storage for complex data
- Better than localStorage for objects
- Supports queries and indexes
- Async API with Promises
- Good TypeScript support

### PWA Support: **Vite PWA Plugin**
- Service worker generation
- Offline capability
- Install prompt for "add to home screen"
- Push notification support
- Works on Android and all platforms

### Date Handling: **date-fns**
- Modern, lightweight date utility library
- Tree-shakeable
- Immutable
- Better than moment.js for bundle size

### Testing:
- **Vitest** - Unit testing (Vite-native)
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (optional, for full flow testing)

## Architecture Overview

### Project Structure
```
daily-task/
├── public/
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── features/      # Feature-specific components
│   │   └── layouts/       # Layout components
│   ├── stores/            # Zustand stores
│   ├── db/                # Database layer (Dexie)
│   ├── utils/             # Utility functions
│   │   ├── prioritization.ts
│   │   ├── dateHelpers.ts
│   │   └── notifications.ts
│   ├── types/             # TypeScript types
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── tests/                 # Test files
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Data Models

#### Task Model
```typescript
interface Task {
  id: string;                    // UUID
  name: string;                  // Task name (required)
  description?: string;          // Optional description
  importance: ImportanceLevel;   // Low | Medium | High | Critical
  deadline?: Date;               // Optional deadline
  estimatedDuration: Duration;   // 15min | 30min | 1h | 2h | 4h | fullday
  createdAt: Date;              // Timestamp when created
  completedAt?: Date;           // Timestamp when completed
  postponedUntil?: Date;        // Cooldown end date
  postponeReason?: string;      // Optional reason for postponement
  status: TaskStatus;           // pending | completed | postponed
}

enum ImportanceLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

enum Duration {
  FifteenMin = 15,
  ThirtyMin = 30,
  OneHour = 60,
  TwoHours = 120,
  FourHours = 240,
  FullDay = 480
}

enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
  Postponed = 'postponed'
}
```

#### App State Model
```typescript
interface AppState {
  lastDailyCheckDate?: Date;        // Last time user did morning check
  dailyTaskId?: string;             // Current daily task ID
  notificationTime: string;         // Time for daily notification (HH:mm format)
  notificationsEnabled: boolean;    // Push notifications on/off
  theme: 'light' | 'dark';         // Theme preference
  hasCompletedOnboarding: boolean; // First-time experience flag
  todayTimeAvailability?: 'normal' | 'extra' | 'limited'; // Today's availability
}
```

### Database Schema (IndexedDB via Dexie)

```typescript
class DailyTaskDatabase extends Dexie {
  tasks!: Table<Task>;
  appState!: Table<AppState>;

  constructor() {
    super('DailyTaskDB');
    this.version(1).stores({
      tasks: 'id, status, deadline, createdAt, postponedUntil, importance',
      appState: 'id'  // Single row with id: 'state'
    });
  }
}
```

**Indexes:**
- `tasks.status` - Filter by status
- `tasks.deadline` - Sort by deadline
- `tasks.createdAt` - Sort by creation date
- `tasks.postponedUntil` - Filter out cooldown tasks
- `tasks.importance` - Sort by importance

## Core Algorithms

### Task Prioritization Algorithm

**Function: `selectDailyTask(timeAvailability: TimeAvailability): Task | null`**

```typescript
function selectDailyTask(timeAvailability: 'normal' | 'extra' | 'limited'): Task | null {
  // 1. Get all eligible tasks
  const eligibleTasks = tasks.filter(task => {
    return task.status === 'pending' &&
           (task.postponedUntil === null || task.postponedUntil <= new Date());
  });

  if (eligibleTasks.length === 0) return null;

  // 2. Filter by duration based on time availability
  let filteredByDuration = eligibleTasks;
  if (timeAvailability === 'extra') {
    // Prefer longer tasks (2+ hours)
    const longTasks = eligibleTasks.filter(t => t.estimatedDuration >= 120);
    if (longTasks.length > 0) filteredByDuration = longTasks;
  } else if (timeAvailability === 'limited') {
    // Prefer shorter tasks (≤1 hour)
    const shortTasks = eligibleTasks.filter(t => t.estimatedDuration <= 60);
    if (shortTasks.length > 0) filteredByDuration = shortTasks;
  }

  // 3. Calculate priority score for each task
  const scoredTasks = filteredByDuration.map(task => ({
    task,
    score: calculatePriorityScore(task)
  }));

  // 4. Sort by score (highest first)
  scoredTasks.sort((a, b) => b.score - a.score);

  // 5. Return highest priority task
  return scoredTasks[0].task;
}

function calculatePriorityScore(task: Task): number {
  let score = 0;

  // Importance weight (0-40 points)
  score += task.importance * 10;

  // Deadline urgency (0-40 points)
  if (task.deadline) {
    const daysUntilDeadline = differenceInDays(task.deadline, new Date());
    if (daysUntilDeadline < 0) {
      score += 40; // Overdue - maximum urgency
    } else if (daysUntilDeadline === 0) {
      score += 35; // Due today
    } else if (daysUntilDeadline <= 3) {
      score += 30; // Due in 3 days
    } else if (daysUntilDeadline <= 7) {
      score += 20; // Due this week
    } else if (daysUntilDeadline <= 14) {
      score += 10; // Due in 2 weeks
    }
  }

  // Age factor (0-20 points) - prevent task starvation
  const daysInQueue = differenceInDays(new Date(), task.createdAt);
  score += Math.min(daysInQueue, 20);

  return score;
}
```

### Daily Check Flow

```typescript
async function handleDailyCheck(timeAvailability: 'normal' | 'extra' | 'limited'): Promise<Task | null> {
  const today = startOfDay(new Date());
  const appState = await getAppState();

  // Check if we've already done daily check today
  if (appState.lastDailyCheckDate &&
      isSameDay(appState.lastDailyCheckDate, today)) {
    // Already checked today, return existing daily task
    if (appState.dailyTaskId) {
      return await getTaskById(appState.dailyTaskId);
    }
    return null;
  }

  // New day - select new task
  const selectedTask = selectDailyTask(timeAvailability);

  if (selectedTask) {
    // Update app state
    await updateAppState({
      lastDailyCheckDate: today,
      dailyTaskId: selectedTask.id,
      todayTimeAvailability: timeAvailability
    });
  }

  return selectedTask;
}
```

### Postponement Logic

```typescript
async function postponeTask(taskId: string, cooldownDays: number, reason?: string): Promise<Task | null> {
  const task = await getTaskById(taskId);
  if (!task) return null;

  // Calculate cooldown end date
  const cooldownEnd = addDays(new Date(), cooldownDays);

  // Update task
  await updateTask(taskId, {
    status: 'postponed',
    postponedUntil: cooldownEnd,
    postponeReason: reason
  });

  // Clear current daily task
  await updateAppState({
    dailyTaskId: undefined
  });

  // Select a new task for today
  const appState = await getAppState();
  const newTask = selectDailyTask(appState.todayTimeAvailability || 'normal');

  if (newTask) {
    await updateAppState({
      dailyTaskId: newTask.id
    });
  }

  return newTask;
}
```

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── OnboardingFlow (first time only)
│   │   ├── WelcomeScreen
│   │   ├── TutorialSlides
│   │   └── FirstTaskEntry
│   │
│   ├── DailyTaskView (main view)
│   │   ├── TimeAvailabilityCheck (morning only)
│   │   ├── TaskCard
│   │   │   ├── TaskDetails
│   │   │   ├── CompleteButton
│   │   │   └── PostponeButton
│   │   └── EmptyState (after completion)
│   │
│   ├── TaskManagementView
│   │   ├── TaskList
│   │   │   └── TaskListItem
│   │   └── AddTaskButton
│   │
│   ├── AddEditTaskForm
│   │   ├── TextInput (name)
│   │   ├── TextArea (description)
│   │   ├── ImportanceSelector
│   │   ├── DurationSelector
│   │   ├── DatePicker (deadline)
│   │   └── SaveButton
│   │
│   ├── PostponeDialog
│   │   ├── CooldownOptions
│   │   ├── ReasonInput
│   │   └── ConfirmButton
│   │
│   └── SettingsView
│       ├── NotificationSettings
│       ├── ThemeSelector
│       └── DataManagement
│
└── Navigation
    └── MenuButton
```

### Key Components

#### DailyTaskView
```typescript
const DailyTaskView: React.FC = () => {
  const { dailyTask, checkDailyTask, completeTask } = useTaskStore();
  const [showTimeCheck, setShowTimeCheck] = useState(false);

  useEffect(() => {
    const needsTimeCheck = shouldShowTimeAvailabilityCheck();
    setShowTimeCheck(needsTimeCheck);
  }, []);

  if (showTimeCheck) {
    return <TimeAvailabilityCheck onSubmit={checkDailyTask} />;
  }

  if (!dailyTask) {
    return <EmptyState />;
  }

  return <TaskCard task={dailyTask} onComplete={completeTask} />;
};
```

#### TaskCard
```typescript
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const [showPostpone, setShowPostpone] = useState(false);

  return (
    <div className="task-card">
      <h1>{task.name}</h1>
      {task.description && <p>{task.description}</p>}
      <div className="task-meta">
        <DurationBadge duration={task.estimatedDuration} />
        {task.deadline && <DeadlineBadge deadline={task.deadline} />}
      </div>
      <div className="actions">
        <Button onClick={() => onComplete(task.id)}>Mark Complete</Button>
        <Button variant="secondary" onClick={() => setShowPostpone(true)}>
          Can't do today
        </Button>
      </div>
      {showPostpone && (
        <PostponeDialog
          task={task}
          onClose={() => setShowPostpone(false)}
        />
      )}
    </div>
  );
};
```

## State Management (Zustand)

```typescript
interface TaskStore {
  tasks: Task[];
  dailyTask: Task | null;
  appState: AppState;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  postponeTask: (id: string, days: number, reason?: string) => Promise<void>;
  checkDailyTask: (availability: TimeAvailability) => Promise<void>;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  dailyTask: null,
  appState: defaultAppState,

  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    const appState = await db.appState.get('state');
    let dailyTask = null;

    if (appState?.dailyTaskId) {
      dailyTask = await db.tasks.get(appState.dailyTaskId);
    }

    set({ tasks, appState, dailyTask });
  },

  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: TaskStatus.Pending
    };
    await db.tasks.add(newTask);
    set(state => ({ tasks: [...state.tasks, newTask] }));
  },

  completeTask: async (id) => {
    await db.tasks.update(id, {
      status: TaskStatus.Completed,
      completedAt: new Date()
    });
    await db.appState.update('state', { dailyTaskId: undefined });

    const tasks = await db.tasks.toArray();
    set({ tasks, dailyTask: null });
  },

  // ... other actions
}));
```

## PWA Configuration

### Manifest (manifest.json)
```json
{
  "name": "Daily Task",
  "short_name": "DailyTask",
  "description": "One important thing, every day",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Strategy
- **Cache First** for static assets (JS, CSS, fonts)
- **Network First** for API-like calls (none in our case)
- **Offline fallback** for the main app shell

### Push Notifications
```typescript
// Request permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Schedule daily notification
function scheduleDailyNotification(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Daily Task', {
        body: 'Ready for today? Your task is waiting.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'daily-task',
        requireInteraction: false
      });
    }
    // Reschedule for next day
    scheduleDailyNotification(time);
  }, delay);
}
```

## Routing Strategy

Using **React Router v6** for navigation:

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DailyTaskView />
      },
      {
        path: 'onboarding',
        element: <OnboardingFlow />
      },
      {
        path: 'tasks',
        element: <TaskManagementView />
      },
      {
        path: 'tasks/new',
        element: <AddEditTaskForm />
      },
      {
        path: 'tasks/:id/edit',
        element: <AddEditTaskForm />
      },
      {
        path: 'settings',
        element: <SettingsView />
      }
    ]
  }
]);
```

## Build and Deployment

### Development
```bash
npm run dev          # Start dev server (Vite)
npm run test         # Run tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment Options

1. **Static Hosting** (Recommended)
   - Vercel, Netlify, GitHub Pages
   - Deploy the `dist` folder
   - Configure as SPA (single-page app)

2. **Self-hosted**
   - Serve the `dist` folder with any static server
   - Nginx, Apache, or simple Node.js server

## Performance Considerations

### Bundle Size Optimization
- Tree-shaking with Vite
- Code splitting by route
- Lazy load heavy components
- Optimize images and icons

### Runtime Performance
- Virtual scrolling for task list (if > 100 items)
- Debounced search/filter
- Memoization for expensive calculations
- IndexedDB queries with proper indexes

### Offline Support
- Service worker caches all assets
- App fully functional offline
- No network requests (100% local)

## Security Considerations

### Data Privacy
- No external API calls
- No analytics or tracking
- No user accounts or authentication
- All data stays on device

### XSS Prevention
- React's built-in XSS protection
- Sanitize user input in task names/descriptions
- No `dangerouslySetInnerHTML` usage

## Testing Strategy

### Unit Tests
- Prioritization algorithm
- Date calculations
- Task CRUD operations
- State management logic

### Component Tests
- User interactions
- Form validation
- Conditional rendering
- State updates

### E2E Tests
- Complete task flow
- Postpone task flow
- Add/edit task flow
- Daily check flow

## Implementation Plan

### Phase 1: Core Setup (Day 1)
1. Initialize Vite + React + TypeScript project
2. Set up Tailwind CSS
3. Configure Dexie database
4. Set up Zustand store
5. Create basic project structure

### Phase 2: Data Layer (Day 1-2)
1. Define TypeScript types
2. Implement database schema
3. Create CRUD operations
4. Build prioritization algorithm
5. Write unit tests for core logic

### Phase 3: Core UI (Day 2-3)
1. Build task card component
2. Create daily task view
3. Implement time availability check
4. Build task completion flow
5. Create empty states

### Phase 4: Task Management (Day 3-4)
1. Build add/edit task form
2. Create task list view
3. Implement postponement dialog
4. Add task deletion
5. Form validation

### Phase 5: Settings & Polish (Day 4-5)
1. Build settings screen
2. Implement notification system
3. Add dark mode
4. Create onboarding flow
5. Polish UI/UX

### Phase 6: PWA & Testing (Day 5-6)
1. Configure PWA manifest
2. Set up service worker
3. Test offline functionality
4. Run E2E tests
5. Fix bugs and edge cases

### Phase 7: Documentation (Day 6)
1. Write README
2. Create user guide
3. Document API/architecture
4. Add code comments
5. Prepare for release

## Future Enhancements (Post-MVP)

These features can be added later without breaking changes:
- Data export/import (JSON format)
- Task templates
- Custom notification sounds
- Widget for Android home screen
- Weekly/monthly review screen
- Accessibility improvements
- Multiple language support
- Task notes/comments
