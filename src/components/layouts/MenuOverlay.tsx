import { Link, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../stores/taskStore';
import { getEligibleTasksForToday } from '../../utils/prioritization';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);

  const pendingCount = getEligibleTasksForToday(tasks).length;

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 pointer-events-auto overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu content */}
          <div className="flex flex-col items-center justify-center space-y-8 w-full px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Menu
            </h2>

            {/* Task count */}
            {pendingCount > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-500 text-white shadow-lg">
                  <span className="text-6xl font-bold">{pendingCount}</span>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-3">
                  Pending tasks
                </p>
              </div>
            )}

            {/* Menu items */}
            <div className="flex flex-col w-full space-y-4">
              <button
                onClick={() => handleNavigation('/')}
                className="w-full px-6 py-4 rounded-lg text-lg font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                Today's Task
              </button>

              <button
                onClick={() => handleNavigation('/tasks')}
                className="w-full px-6 py-4 rounded-lg text-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
              >
                All Tasks
              </button>

              <button
                onClick={() => handleNavigation('/tasks/new')}
                className="w-full px-6 py-4 rounded-lg text-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
              >
                + Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
