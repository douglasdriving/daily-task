import React, { useState } from 'react';
import { Task, POSTPONE_OPTIONS } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  formatDuration,
  getImportanceLabel,
  getImportanceColor,
} from '../../utils/prioritization';
import { formatDeadline, getDeadlineColor } from '../../utils/dateHelpers';
import { useTaskStore } from '../../stores/taskStore';
import { PostponeDialog } from './PostponeDialog';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const completeTask = useTaskStore(state => state.completeTask);
  const [showPostpone, setShowPostpone] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeTask(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-medium text-[#450920] dark:text-[#F9DBBD] leading-tight">
          {task.name}
        </h1>
      </div>

      <Card className="mb-8">
        {task.description && (
          <p className="text-[#A53860] dark:text-[#FFA5AB] mb-6 font-light text-lg leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getImportanceColor(task.importance)}`}>
            {getImportanceLabel(task.importance)} priority
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F9DBBD] text-[#450920] dark:bg-[#6f2440] dark:text-[#F9DBBD]">
            {formatDuration(task.estimatedDuration)}
          </span>

          {task.deadline && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDeadlineColor(task.deadline)}`}>
              {formatDeadline(task.deadline)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleComplete}
            disabled={isCompleting}
            size="lg"
            className="w-full"
          >
            {isCompleting ? 'Completing...' : 'Mark Complete'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowPostpone(true)}
            disabled={isCompleting}
            className="w-full"
          >
            Can't do today
          </Button>
        </div>
      </Card>

      {showPostpone && (
        <PostponeDialog
          task={task}
          onClose={() => setShowPostpone(false)}
        />
      )}
    </div>
  );
}
