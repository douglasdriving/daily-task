import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  type: 'completed' | 'noTasks';
}

export function EmptyState({ type }: EmptyStateProps) {
  const navigate = useNavigate();

  if (type === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Well done!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You've completed your task for today.
          </p>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Rest well. See you tomorrow!
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/tasks')}
        >
          View All Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No tasks available
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Add some tasks to get started.
        </p>
      </div>

      <Button
        variant="primary"
        onClick={() => navigate('/tasks/new')}
        size="lg"
      >
        Add Your First Task
      </Button>
    </div>
  );
}
