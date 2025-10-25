import React from 'react';

interface EmptyStateProps {
  type: 'completed' | 'noTasks';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-5xl font-medium text-burgundy dark:text-peach mb-4">
            Done.
          </h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="text-7xl mb-8">📝</div>
      <h1 className="text-4xl font-medium text-burgundy dark:text-peach mb-2">
        No tasks yet
      </h1>
      <p className="text-lg font-light text-burgundy-light dark:text-primary-200">
        Tap the + button to add your first task
      </p>
    </div>
  );
}
