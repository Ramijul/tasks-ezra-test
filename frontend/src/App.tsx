import React from 'react';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  const {
    loading,
    error,
  } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#ef4444', marginBottom: '16px' }}>
            Error: {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskList />
    </div>
  );
}

export default App;
