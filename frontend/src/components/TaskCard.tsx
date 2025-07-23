import React from 'react';
import type { Task } from '../types/Task';
import EditableText from './EditableText';
import TaskDescription from './TaskDescription';
import { useTasks } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
}

/**
 * A component that displays a task card with a title, description, and delete button.
 * 
 * utilized EditableText component for title and description
 * 
 * @param task - The task object containing the task details
 * @returns A React component that displays the task card
 */
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTaskTitle, updateTaskDescription, toggleTaskCompletion, deleteTask } = useTasks();

  const handleTitleSave = (newTitle: string) => {
    updateTaskTitle(task.id, newTitle);
  };

  const handleDescriptionSave = (newDescription: string) => {
    updateTaskDescription(task.id, newDescription);
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 border border-gray-200"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '16px'
      }}
    >
      {/* Checkbox - Left aligned and centered */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => toggleTaskCompletion(task.id, e.target.checked)}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: '2px solid #d1d5db',
            backgroundColor: task.isCompleted ? '#10b981' : 'white',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            position: 'relative'
          }}
        />
      </div>

      {/* Task Content - Takes maximum space, left aligned */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <EditableText
          value={task.title}
          onSave={handleTitleSave}
          isEditable={!task.isCompleted}
          style={{
            textAlign: 'left',
            fontWeight: '500',
            fontSize: '16px'
          }}
          maxLength={200}
        />

        {/* Description */}
        <TaskDescription
          description={task.description || ''}
          isCompleted={task.isCompleted}
          onSave={handleDescriptionSave}
        />
      </div>

      {/* Delete Button - Right aligned and centered */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard; 