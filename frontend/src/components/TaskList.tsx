import React from 'react';
import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import { useTasks } from '../hooks/useTasks';

/**
 * A component that displays a list of tasks with a header and a button to add a new task.
 * 
 * A new task is created with a default title and empty description, with auto-focus on the title input
 * 
 * @returns A React component that displays the task list
 */
const TaskList: React.FC = () => {
  const {
    tasks,
    createTask,
  } = useTasks();

  const handleAddTask = async () => {
    try {
      // Calculate the next title number based on existing tasks
      const titleCount = tasks.length + 1;
      const defaultTitle = `Title ${titleCount}`;
      
      // Create a new task with default title and empty description
      await createTask({
        title: defaultTitle,
        description: ''
      });
      
      // The new task will be added to the top of the list
      // The EditableText component will automatically focus on the title input
      // because it's a new task with a default title that can be edited
    } catch (error) {
      console.error('Failed to create new task:', error);
    }
  };

  // Sort tasks: unchecked first, then checked (most recently checked at top of checked section)
  const sortedTasks = [...tasks].sort((a, b) => {
    // First, separate unchecked and checked tasks
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1; // Unchecked first
    }
    
    // If both are checked, sort by updatedAt (most recent first)
    if (a.isCompleted && b.isCompleted) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    
    // If both are unchecked, maintain original order
    return 0;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Tasks</h1>
        
        {/* Add Task Button - Right aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AddTaskButton onClick={handleAddTask} />
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <svg 
                viewBox="0 0 24 24"
                style={{ width: '64px', height: '64px', margin: '0 auto', color: '#9ca3af' }}
                fill="none"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              No tasks yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Get started by adding your first task
            </p>
            <AddTaskButton onClick={handleAddTask} />
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList; 