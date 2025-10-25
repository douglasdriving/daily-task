import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTaskStore } from './stores/taskStore';
import { MenuOverlay } from './components/layouts/MenuOverlay';
import { DailyTaskView } from './components/features/DailyTaskView';
import { TaskForm } from './components/features/TaskForm';
import { TaskListView } from './components/features/TaskListView';

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zen-cream dark:bg-gray-900">
      {/* Menu button - fixed in top-right corner */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Menu overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content */}
      <Routes>
        <Route path="/" element={<DailyTaskView />} />
        <Route path="/tasks" element={<TaskListView />} />
        <Route path="/tasks/new" element={<TaskForm />} />
      </Routes>
    </div>
  );
}

function App() {
  const { initialize, appState } = useTaskStore();

  useEffect(() => {
    // Initialize the app
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Apply theme from app state
    if (appState?.theme) {
      if (appState.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [appState?.theme]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
