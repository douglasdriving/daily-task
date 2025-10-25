import React from 'react';

interface EmptyStateProps {
  type: 'completed' | 'noTasks';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-5xl font-serif font-semibold text-zen-bark dark:text-gray-100 mb-4">
            Done.
          </h1>
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
