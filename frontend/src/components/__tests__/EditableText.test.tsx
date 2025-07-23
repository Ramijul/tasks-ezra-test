import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditableText from '../EditableText';

describe('EditableText', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the value when not editing', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should switch to edit mode when clicked', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Test Value'));

    const input = screen.getByDisplayValue('Test Value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should save on Enter key', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Test Value'));
    const input = screen.getByDisplayValue('Test Value');
    
    fireEvent.change(input, { target: { value: 'Updated Value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith('Updated Value');
  });

  it('should save on blur', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Test Value'));
    const input = screen.getByDisplayValue('Test Value');
    
    fireEvent.change(input, { target: { value: 'Updated Value' } });
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith('Updated Value');
  });

  it('should render textarea for multiline', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
        multiline={true}
      />
    );

    fireEvent.click(screen.getByText('Test Value'));

    const textarea = screen.getByDisplayValue('Test Value');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should save on Ctrl+Enter for multiline', () => {
    render(
      <EditableText
        value="Test Value"
        onSave={mockOnSave}
        multiline={true}
      />
    );

    fireEvent.click(screen.getByText('Test Value'));
    const textarea = screen.getByDisplayValue('Test Value');
    
    fireEvent.change(textarea, { target: { value: 'Updated Value' } });
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

    expect(mockOnSave).toHaveBeenCalledWith('Updated Value');
  });

  it('should auto-start editing for empty values', () => {
    render(
      <EditableText
        value=""
        onSave={mockOnSave}
      />
    );

    const input = screen.getByDisplayValue('');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should auto-start editing for default titles', () => {
    render(
      <EditableText
        value="Title 1"
        onSave={mockOnSave}
      />
    );

    const input = screen.getByDisplayValue('Title 1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });
}); 