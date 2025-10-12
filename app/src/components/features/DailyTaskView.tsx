import React, { useEffect } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TimeAvailabilityCheck } from './TimeAvailabilityCheck';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

export function DailyTaskView() {
  const { dailyTask, showTimeCheck, checkDailyTask, isLoading } = useTaskStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (showTimeCheck) {
    return <TimeAvailabilityCheck onSubmit={checkDailyTask} />;
  }

  if (!dailyTask) {
    return <EmptyState type="noTasks" />;
  }

  return <TaskCard task={dailyTask} />;
}
