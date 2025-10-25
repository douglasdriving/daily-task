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
        <h1 className="text-5xl md:text-7xl font-bangers text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-tight transform -rotate-2 animate-pulse">
          {task.name.toUpperCase()}
        </h1>
      </div>

      <div className="bg-white/90 dark:bg-black/80 p-8 rounded-3xl shadow-2xl border-8 border-black transform hover:scale-105 transition-all mb-8">
        {task.description && (
          <p className="text-black dark:text-white mb-6 font-sans text-xl leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {task.deadline && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-shrikhand bg-neon-orange text-white border-4 border-black transform -rotate-1">
              {formatDeadline(task.deadline)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full px-8 py-6 rounded-2xl text-3xl font-bangers bg-neon-lime text-black hover:bg-neon-yellow transition-all shadow-2xl hover:shadow-neon-cyan hover:scale-105 border-4 border-black transform -rotate-1 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? 'COMPLETING...' : '✓ DONE!'}
          </button>

          <button
            onClick={() => setShowPostpone(true)}
            disabled={isCompleting}
            className="w-full px-8 py-4 rounded-2xl text-xl font-shrikhand bg-neon-pink text-white hover:bg-neon-purple transition-all shadow-xl hover:shadow-neon-orange hover:scale-105 border-4 border-black transform rotate-1 hover:-rotate-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Not Today...
          </button>
        </div>
      </div>

      {showPostpone && (
        <PostponeDialog
          task={task}
          onClose={() => setShowPostpone(false)}
        />
      )}
    </div>
  );
}
