import React from 'react';
import { Task } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PreviousDayTaskCheckProps {
  task: Task;
  onCompleted: () => void;
  onNotCompleted: () => void;
}

export function PreviousDayTaskCheck({ task, onCompleted, onNotCompleted }: PreviousDayTaskCheckProps) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-semibold text-zen-bark dark:text-gray-100 mb-6">
          Quick check
        </h1>
        <p className="text-lg text-zen-earth dark:text-gray-400 mb-4">
          Yesterday you were supposed to do:
        </p>
        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {task.name}
          </h2>
        </Card>
        <p className="text-lg text-zen-earth dark:text-gray-400">
          Did you complete this task?
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={onCompleted}
          className="w-full"
          size="lg"
        >
          Yes, I completed it
        </Button>

        <Button
          variant="secondary"
          onClick={onNotCompleted}
          className="w-full"
          size="lg"
        >
          No, I didn't
        </Button>
      </div>
    </div>
  );
}
