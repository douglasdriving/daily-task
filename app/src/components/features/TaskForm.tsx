import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImportanceLevel, Duration, TaskFormData } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

const importanceOptions = [
  { value: ImportanceLevel.Low, label: 'Low' },
  { value: ImportanceLevel.Medium, label: 'Medium' },
  { value: ImportanceLevel.High, label: 'High' },
  { value: ImportanceLevel.Critical, label: 'Critical' },
];

const durationOptions = [
  { value: Duration.FifteenMin, label: '15 minutes' },
  { value: Duration.ThirtyMin, label: '30 minutes' },
  { value: Duration.OneHour, label: '1 hour' },
  { value: Duration.TwoHours, label: '2 hours' },
  { value: Duration.FourHours, label: '4 hours' },
  { value: Duration.FullDay, label: 'Full day' },
];

export function TaskForm() {
  const navigate = useNavigate();
  const addTask = useTaskStore(state => state.addTask);

  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    importance: ImportanceLevel.Medium,
    estimatedDuration: Duration.OneHour,
  });

  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: 'Task name is required' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const taskData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim(),
        deadline: hasDeadline && deadlineDate ? new Date(deadlineDate) : undefined,
      };

      await addTask(taskData);
      navigate('/');
    } catch (error) {
      console.error('Error adding task:', error);
      setErrors({ name: 'Failed to add task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Add New Task
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="What needs to be done?"
            error={errors.name}
            autoFocus
          />

          <TextArea
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add additional details..."
            rows={3}
          />

          <Select
            label="Importance *"
            value={formData.importance}
            onChange={(e) => setFormData({
              ...formData,
              importance: Number(e.target.value) as ImportanceLevel
            })}
            options={importanceOptions}
          />

          <Select
            label="Estimated Duration *"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({
              ...formData,
              estimatedDuration: Number(e.target.value) as Duration
            })}
            options={durationOptions}
          />

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDeadline}
                onChange={(e) => setHasDeadline(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                This task has a deadline
              </span>
            </label>
          </div>

          {hasDeadline && (
            <Input
              label="Deadline"
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
