import React from 'react';

interface EmptyStateProps {
  type: 'completed' | 'noTasks';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="mb-12">
          <div className="text-7xl mb-8">✓</div>
          <h1 className="text-5xl font-serif font-semibold text-zen-bark dark:text-gray-100 mb-4">
            Well done
          </h1>
          <p className="text-xl font-light text-zen-earth dark:text-gray-400">
            You've completed your task for today.
          </p>
        </div>

        <div className="bg-zen-sand/50 dark:bg-primary-900/20 rounded-2xl p-8">
          <p className="text-zen-earth dark:text-gray-300 font-serif text-lg italic">
            Rest well. See you tomorrow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="text-7xl mb-8">📝</div>
      <h1 className="text-4xl font-serif font-semibold text-zen-bark dark:text-gray-100 mb-2">
        No tasks yet
      </h1>
      <p className="text-lg text-zen-earth dark:text-gray-400">
        Tap the + button to add your first task
      </p>
    </div>
  );
}
