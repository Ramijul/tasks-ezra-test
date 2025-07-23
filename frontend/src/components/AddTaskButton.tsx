import React from 'react';

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        style={{ width: '16px', height: '16px' }}
        fill="none"
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4v16m8-8H4" 
        />
      </svg>
      <span>Add a task</span>
    </button>
  );
};

export default AddTaskButton; 