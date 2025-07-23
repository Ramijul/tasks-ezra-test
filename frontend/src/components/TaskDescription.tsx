import React, { useState, useEffect } from 'react';
import EditableText from './EditableText';

interface TaskDescriptionProps {
  description: string;
  isCompleted: boolean;
  onSave: (newDescription: string) => void;
}

/**
 * A component that renders an editable task description with the following features:
 * - Displays description text with a responsive character limit (100 for mobile, 300 for desktop)
 * - Shows "..." and expand button if description exceeds character limit
 * - Hides description field if task is completed and has no description
 * - Allows editing description if task is not completed
 * - Shows placeholder text in italic when empty
 * - Has a max length of 1000 characters
 * - Responsive to screen size changes
 * 
 * @param description - The task description text
 * @param isCompleted - Whether the task is marked as complete
 * @param onSave - Callback function when description is edited
 * @returns React component
 */
const TaskDescription: React.FC<TaskDescriptionProps> = ({ 
  description, 
  isCompleted, 
  onSave 
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Responsive character limit: 100 for mobile, 300 for tablet and up
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const characterLimit = isMobile ? 100 : 300;
  const hasDescription = description && description.trim() !== '';
  const shouldShowMoreButton = hasDescription && description.length > characterLimit;
  const displayDescription = shouldShowMoreButton && !isDescriptionExpanded
    ? description.substring(0, characterLimit) + '...'
    : description;

  // Don't show description field if task is completed and has no description
  if (isCompleted && !hasDescription) {
    return null;
  }

  return (
    <div>
      <EditableText
        value={displayDescription}
        onSave={onSave}
        isEditable={!isCompleted}
        multiline={true}
        placeholder="Enter task description..."
        style={{
          textAlign: 'left',
          fontSize: '14px',
          color: hasDescription ? '#6b7280' : '#9ca3af',
          marginTop: '4px',
          fontStyle: hasDescription ? 'normal' : 'italic'
        }}
        maxLength={1000}
      />
      {shouldShowMoreButton && (
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            marginTop: '4px',
            padding: '4px 8px'
          }}
        >
          {isDescriptionExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default TaskDescription; 