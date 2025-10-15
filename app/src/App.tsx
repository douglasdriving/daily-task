import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTaskStore } from './stores/taskStore';
import { Navigation } from './components/layouts/Navigation';
import { DailyTaskView } from './components/features/DailyTaskView';
import { TaskForm } from './components/features/TaskForm';
import { TaskListView } from './components/features/TaskListView';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [swiping, setSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!swiping) return;
    setSwiping(false);

    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;

    // Only allow swipe on main views (not on task form)
    if (location.pathname === '/tasks/new') return;

    // Swipe left: go from Today to All Tasks
    if (swipeDistance < -minSwipeDistance && location.pathname === '/') {
      navigate('/tasks');
    }

    // Swipe right: go from All Tasks to Today
    if (swipeDistance > minSwipeDistance && location.pathname === '/tasks') {
      navigate('/');
    }
  };

  return (
    <div
      className="min-h-screen bg-zen-cream dark:bg-gray-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Navigation />
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
