import { useTaskStore } from '../../stores/taskStore';
import { TimeAvailabilityCheck } from './TimeAvailabilityCheck';
import { PreviousDayTaskCheck } from './PreviousDayTaskCheck';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { startOfDay } from 'date-fns';

export function DailyTaskView() {
  const {
    dailyTask,
    showTimeCheck,
    checkDailyTask,
    isLoading,
    appState,
    showPreviousDayCheck,
    previousDayTask,
    handlePreviousDayTaskCompleted,
    handlePreviousDayTaskNotCompleted,
  } = useTaskStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (showPreviousDayCheck && previousDayTask) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PreviousDayTaskCheck
          task={previousDayTask}
          onCompleted={handlePreviousDayTaskCompleted}
          onNotCompleted={handlePreviousDayTaskNotCompleted}
        />
      </div>
    );
  }

  if (showTimeCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <TimeAvailabilityCheck onSubmit={checkDailyTask} />
      </div>
    );
  }

  if (!dailyTask) {
    // Check if we've completed a task today
    const today = startOfDay(new Date());
    const hasCompletedToday = appState?.lastCompletionDate &&
      startOfDay(appState.lastCompletionDate).getTime() === today.getTime();

    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <EmptyState type={hasCompletedToday ? "completed" : "noTasks"} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <TaskCard task={dailyTask} />
    </div>
  );
}
