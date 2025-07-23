import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  maxLength?: number;
}

/**
 * A component that renders an editable text input with the following features:
 * - Automatically starts editing when the value is empty or matches a default title pattern
 * - Allows editing of text input or multiline text area
 * - Saves the edited value when the input loses focus or the Enter key is pressed
 * - Cancels the edit when the Escape key is pressed
 */
const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  isEditable = true,
  multiline = false,
  placeholder = '',
  className = '',
  style = {},
  maxLength
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Auto-start editing for empty values (new tasks)
  useEffect(() => {
    if (value === '' && isEditable && !multiline) {
      setIsEditing(true);
    }
  }, [value, isEditable, multiline]);

  // Auto-start editing for default titles (new tasks)
  useEffect(() => {
    const isDefaultTitle = /^Title \d+$/.test(value);
    if (isDefaultTitle && isEditable && !multiline) {
      setIsEditing(true);
    }
  }, [value, isEditable, multiline]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      const element = multiline ? textareaRef.current : inputRef.current;
      if (element) {
        element.focus();
        element.select();
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const trimmedValue = multiline ? editValue : editValue.trim();
    if (trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (multiline) {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    }
  };

  const baseTextStyle: React.CSSProperties = {
    cursor: isEditable ? 'pointer' : 'default',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ...style
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #3b82f6',
    borderRadius: '4px',
    padding: '4px 8px',
    outline: 'none',
    fontFamily: 'inherit',
    ...style
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            ...inputStyle,
            fontSize: '14px',
            color: '#6b7280',
            resize: 'vertical',
            minHeight: '60px',
            fontStyle: 'normal' // Always use normal font style when editing
          }}
        />
      );
    } else {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            ...inputStyle,
            fontSize: '16px',
            fontWeight: '500',
            fontStyle: 'normal' // Always use normal font style when editing
          }}
        />
      );
    }
  }

  return (
    <div
      className={className}
      style={baseTextStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (isEditable) {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {value || placeholder}
    </div>
  );
};

export default EditableText; 