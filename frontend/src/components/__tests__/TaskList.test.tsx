import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskList from '../TaskList';

// Mock the useTasks hook
vi.mock('../../hooks/useTasks', () => ({
  useTasks: vi.fn(),
}));

import { useTasks } from '../../hooks/useTasks';
const mockUseTasks = vi.mocked(useTasks);

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Test Description 1',
      isCompleted: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Test Description 2',
      isCompleted: true,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ];

  const mockCreateTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockToggleTaskCompletion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task list with tasks', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      refreshTasks: vi.fn(),
      createTask: mockCreateTask,
      deleteTask: mockDeleteTask,
      updateTaskTitle: vi.fn(),
      updateTaskDescription: vi.fn(),
      toggleTaskCompletion: mockToggleTaskCompletion,
    });

    render(<TaskList />);

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('should render empty state when no tasks', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      refreshTasks: vi.fn(),
      createTask: mockCreateTask,
      deleteTask: mockDeleteTask,
      updateTaskTitle: vi.fn(),
      updateTaskDescription: vi.fn(),
      toggleTaskCompletion: mockToggleTaskCompletion,
    });

    render(<TaskList />);

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first task')).toBeInTheDocument();
  });

  it('should call createTask when add task button is clicked', async () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      refreshTasks: vi.fn(),
      createTask: mockCreateTask,
      deleteTask: mockDeleteTask,
      updateTaskTitle: vi.fn(),
      updateTaskDescription: vi.fn(),
      toggleTaskCompletion: mockToggleTaskCompletion,
    });

    mockCreateTask.mockResolvedValue({});

    render(<TaskList />);

    const addButtons = screen.getAllByText('Add a task');
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Title 1',
        description: '',
      });
    });
  });

  it('should sort tasks correctly (unchecked first, then checked)', () => {
    const mixedTasks = [
      {
        id: 1,
        title: 'Completed Task',
        description: 'Completed',
        isCompleted: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        title: 'Pending Task',
        description: 'Pending',
        isCompleted: false,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ];

    mockUseTasks.mockReturnValue({
      tasks: mixedTasks,
      loading: false,
      error: null,
      refreshTasks: vi.fn(),
      createTask: mockCreateTask,
      deleteTask: mockDeleteTask,
      updateTaskTitle: vi.fn(),
      updateTaskDescription: vi.fn(),
      toggleTaskCompletion: mockToggleTaskCompletion,
    });

    render(<TaskList />);

    const taskElements = screen.getAllByText(/Task$/);
    expect(taskElements[0]).toHaveTextContent('Pending Task');
    expect(taskElements[1]).toHaveTextContent('Completed Task');
  });
}); 