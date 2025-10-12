import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTaskStore } from './stores/taskStore';
import { DailyTaskView } from './components/features/DailyTaskView';
import { TaskForm } from './components/features/TaskForm';
import { TaskListView } from './components/features/TaskListView';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<DailyTaskView />} />
          <Route path="/tasks" element={<TaskListView />} />
          <Route path="/tasks/new" element={<TaskForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
