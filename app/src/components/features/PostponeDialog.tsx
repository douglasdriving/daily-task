import React, { useState } from 'react';
import { Task, POSTPONE_OPTIONS } from '../../types';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { useTaskStore } from '../../stores/taskStore';

interface PostponeDialogProps {
  task: Task;
  onClose: () => void;
}

export function PostponeDialog({ task, onClose }: PostponeDialogProps) {
  const postponeTask = useTaskStore(state => state.postponeTask);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [isPostponing, setIsPostponing] = useState(false);

  const handlePostpone = async () => {
    if (selectedDays === null) return;

    setIsPostponing(true);
    try {
      await postponeTask(task.id, selectedDays, reason || undefined);
      onClose();
    } catch (error) {
      console.error('Error postponing task:', error);
      setIsPostponing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Postpone Task
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          When can you revisit this task?
        </p>

        <div className="space-y-2 mb-4">
          {POSTPONE_OPTIONS.map((option) => (
            <button
              key={option.days}
              onClick={() => setSelectedDays(option.days)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedDays === option.days
                  ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <TextArea
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you postponing? (optional note)"
          rows={2}
          className="mb-4"
        />

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handlePostpone}
            disabled={selectedDays === null || isPostponing}
            className="flex-1"
          >
            {isPostponing ? 'Postponing...' : 'Postpone'}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isPostponing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
