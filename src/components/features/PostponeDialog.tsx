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
      <div className="bg-white dark:bg-[#5a1d34] rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-[#450920] dark:text-[#F9DBBD] mb-4">
          Postpone Task
        </h2>

        <p className="text-[#A53860] dark:text-[#FFA5AB] font-light mb-4">
          When can you revisit this task?
        </p>

        <div className="space-y-2 mb-4">
          {POSTPONE_OPTIONS.map((option) => (
            <button
              key={option.days}
              onClick={() => setSelectedDays(option.days)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedDays === option.days
                  ? 'bg-[#F9DBBD] dark:bg-[#6f2440] ring-2 ring-[#A53860]'
                  : 'bg-[#fdeae0] dark:bg-[#5a1d34]/50 hover:bg-[#F9DBBD] dark:hover:bg-[#6f2440]'
              }`}
            >
              <span className="font-medium text-[#450920] dark:text-[#F9DBBD]">
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
