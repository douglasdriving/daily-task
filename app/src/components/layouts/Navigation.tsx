import { Link, useLocation } from 'react-router-dom';
import { useTaskStore } from '../../stores/taskStore';
import { getEligibleTasksForToday } from '../../utils/prioritization';

export function Navigation() {
  const location = useLocation();
  const tasks = useTaskStore(state => state.tasks);

  // Count pending tasks (not in cooldown)
  const pendingCount = getEligibleTasksForToday(tasks).length;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              Daily Task
            </Link>
            {pendingCount > 0 && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {pendingCount} pending
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Today
            </Link>

            <Link
              to="/tasks"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/tasks'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Tasks
            </Link>

            <Link
              to="/tasks/new"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <span className="text-lg mr-1">+</span> Add Task
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
