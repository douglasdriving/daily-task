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
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (showPreviousDayCheck && previousDayTask) {
    return (
      <PreviousDayTaskCheck
        task={previousDayTask}
        onCompleted={handlePreviousDayTaskCompleted}
        onNotCompleted={handlePreviousDayTaskNotCompleted}
      />
    );
  }

  if (showTimeCheck) {
    return <TimeAvailabilityCheck onSubmit={checkDailyTask} />;
  }

  if (!dailyTask) {
    // Check if we've completed a task today
    const today = startOfDay(new Date());
    const hasCompletedToday = appState?.lastCompletionDate &&
      startOfDay(appState.lastCompletionDate).getTime() === today.getTime();

    return <EmptyState type={hasCompletedToday ? "completed" : "noTasks"} />;
  }

  return <TaskCard task={dailyTask} />;
}
