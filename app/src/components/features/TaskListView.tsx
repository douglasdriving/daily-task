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
  const moveTaskUp = useTaskStore(state => state.moveTaskUp);
  const moveTaskDown = useTaskStore(state => state.moveTaskDown);

  const pendingTasks = tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => a.order - b.order);
  const completedTasks = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0));

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
            {pendingTasks.map((task, index) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveTaskUp(task.id)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveTaskDown(task.id)}
                      disabled={index === pendingTasks.length - 1}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
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
