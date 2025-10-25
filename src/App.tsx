import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTaskStore } from './stores/taskStore';
import { DailyTaskView } from './components/features/DailyTaskView';
import { TaskForm } from './components/features/TaskForm';
import { TaskListView } from './components/features/TaskListView';

function MainView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-peach dark:bg-burgundy">
      {/* Add task button - fixed in top-right corner */}
      <button
        onClick={() => navigate('/tasks/new')}
        className="fixed top-6 right-6 z-40 p-3 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Add task"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Daily task section - full viewport height */}
      <div className="min-h-screen flex items-center justify-center">
        <DailyTaskView />
      </div>

      {/* Task list section - below daily task */}
      <div className="min-h-screen">
        <TaskListView />
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/tasks/new" element={<TaskForm />} />
    </Routes>
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
