import { Link, useLocation } from 'react-router-dom';
import { useTaskStore } from '../../stores/taskStore';
import { getEligibleTasksForToday } from '../../utils/prioritization';

export function Navigation() {
  const location = useLocation();
  const tasks = useTaskStore(state => state.tasks);

  // Count pending tasks (not in cooldown)
  const pendingCount = getEligibleTasksForToday(tasks).length;

  return (
    <nav className="bg-white/80 dark:bg-gray-800 border-b border-zen-stone/30 dark:border-gray-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {pendingCount > 0 && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zen-moss dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold bg-primary-500 text-white shadow-sm">
                  {pendingCount}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-light transition-all ${
                location.pathname === '/'
                  ? 'bg-zen-sand dark:bg-gray-700 text-zen-bark dark:text-gray-100'
                  : 'text-zen-earth dark:text-gray-400 hover:bg-zen-sand/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Today
            </Link>

            <Link
              to="/tasks"
              className={`px-4 py-2 rounded-lg text-sm font-light transition-all ${
                location.pathname === '/tasks'
                  ? 'bg-zen-sand dark:bg-gray-700 text-zen-bark dark:text-gray-100'
                  : 'text-zen-earth dark:text-gray-400 hover:bg-zen-sand/50 dark:hover:bg-gray-700/50'
              }`}
            >
              All Tasks
            </Link>

            <Link
              to="/tasks/new"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-light bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-sm hover:shadow-md ml-2"
            >
              <span className="text-lg mr-1.5">+</span> Add Task
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
