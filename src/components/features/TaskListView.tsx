import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../stores/taskStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  formatDuration,
  getImportanceLabel,
  getImportanceColor,
} from '../../utils/prioritization';
import { formatDeadline, getDeadlineColor } from '../../utils/dateHelpers';

export function TaskListView() {
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);

  const pendingTasks = tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => {
      // Sort by importance (descending - higher first), then by deadline, then by creation date
      if (b.importance !== a.importance) {
        return b.importance - a.importance;
      }
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  const completedTasks = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0));

  const handleIncreaseImportance = async (taskId: string, currentImportance: number) => {
    if (currentImportance < 5) {
      await updateTask(taskId, { importance: currentImportance + 1 });
    }
  };

  const handleDecreaseImportance = async (taskId: string, currentImportance: number) => {
    if (currentImportance > 1) {
      await updateTask(taskId, { importance: currentImportance - 1 });
    }
  };

  const handleDeleteTask = async (taskId: string, taskName: string) => {
    if (window.confirm(`Are you sure you want to delete "${taskName}"?`)) {
      await deleteTask(taskId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          All Tasks
        </h1>
        <Button variant="primary" onClick={() => navigate('/tasks/new')}>
          Add Task
        </Button>
      </div>

      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tasks yet. Add your first task to get started!
          </p>
          <Button variant="primary" onClick={() => navigate('/tasks/new')}>
            Add Task
          </Button>
        </div>
      )}

      {pendingTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Pending Tasks ({pendingTasks.length})
          </h2>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleIncreaseImportance(task.id, task.importance)}
                      disabled={task.importance === 5}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Increase priority"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDecreaseImportance(task.id, task.importance)}
                      disabled={task.importance === 1}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Decrease priority"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getImportanceColor(task.importance)}`}>
                        {getImportanceLabel(task.importance)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {formatDuration(task.estimatedDuration)}
                      </span>
                      {task.deadline && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDeadlineColor(task.deadline)}`}>
                          {formatDeadline(task.deadline)}
                        </span>
                      )}
                      {task.postponedUntil && task.postponedUntil > new Date() && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          On hold
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <button
                      onClick={() => handleDeleteTask(task.id, task.name)}
                      className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <Card key={task.id} className="opacity-75">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {task.name}
                    </h3>
                    {task.completedAt && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Completed on {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Today
        </Button>
      </div>
    </div>
  );
}
