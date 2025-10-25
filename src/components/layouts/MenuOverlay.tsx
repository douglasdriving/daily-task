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
        <div className="relative bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-orange rounded-3xl shadow-2xl border-8 border-black w-full max-w-2xl mx-4 pointer-events-auto overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-xl bg-black hover:bg-neon-yellow transition-all hover:scale-110 hover:rotate-90 border-4 border-white z-10"
            aria-label="Close menu"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu content */}
          <div className="flex flex-col items-center justify-center space-y-8 w-full px-8 py-12">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Daily Task Logo"
          className="w-24 h-24 animate-spin"
          style={{ animationDuration: '10s' }}
        />

        <h2 className="text-6xl font-monoton text-white mb-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] transform -rotate-2">
          MENU
        </h2>

        {/* Task count */}
        {pendingCount > 0 && (
          <div className="text-center transform rotate-3">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-neon-yellow text-black shadow-2xl border-8 border-black animate-pulse">
              <span className="text-6xl font-bangers">{pendingCount}</span>
            </div>
            <p className="text-lg font-shrikhand text-white mt-3 drop-shadow-lg">
              TASKS!
            </p>
          </div>
        )}

        {/* Menu items */}
        <div className="flex flex-col w-full space-y-4">
          <button
            onClick={() => handleNavigation('/')}
            className="w-full px-6 py-5 rounded-2xl text-2xl font-bangers bg-neon-cyan text-black hover:bg-neon-lime transition-all shadow-2xl hover:shadow-neon-yellow hover:scale-105 border-4 border-black transform -rotate-1 hover:rotate-1"
          >
            TODAY'S TASK
          </button>

          <button
            onClick={() => handleNavigation('/tasks')}
            className="w-full px-6 py-5 rounded-2xl text-2xl font-shrikhand bg-neon-pink text-white hover:bg-neon-purple transition-all shadow-2xl hover:shadow-neon-cyan hover:scale-105 border-4 border-black transform rotate-1 hover:-rotate-1"
          >
            ALL TASKS
          </button>

          <button
            onClick={() => handleNavigation('/tasks/new')}
            className="w-full px-6 py-5 rounded-2xl text-2xl font-sans bg-neon-lime text-black hover:bg-neon-yellow transition-all shadow-2xl hover:shadow-neon-orange hover:scale-105 border-4 border-black transform -rotate-1 hover:rotate-2"
          >
            + ADD TASK
          </button>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}
