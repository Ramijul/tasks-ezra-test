import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasks } from '../useTasks';
import type { Task } from '../../types/Task';

// Mock the TaskService
vi.mock('../../services/TaskService', () => ({
  default: {
    getAllTasks: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    updateTaskTitle: vi.fn(),
    updateTaskDescription: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  },
}));

import taskService from '../../services/TaskService';
const mockTaskService = vi.mocked(taskService);

describe('useTasks', () => {
  const mockTasks: Task[] = [
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load tasks on mount', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.tasks).toEqual(mockTasks);
    expect(mockTaskService.getAllTasks).toHaveBeenCalledOnce();
  });

  it('should create a new task and add it to the list', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    const newTask: Task = {
      id: 3,
      title: 'New Task',
      description: 'New Description',
      isCompleted: false,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    };
    mockTaskService.createTask.mockResolvedValue(newTask);
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await act(async () => {
      await result.current.createTask({
        title: 'New Task',
        description: 'New Description',
      });
    });
    
    expect(mockTaskService.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
    });
    expect(result.current.tasks).toHaveLength(3);
    expect(result.current.tasks[0]).toEqual(newTask);
  });

  it('should delete a task from the list', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    mockTaskService.deleteTask.mockResolvedValue();
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await act(async () => {
      await result.current.deleteTask(1);
    });
    
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe(2);
  });

  it('should update task title', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    const updatedTask = { ...mockTasks[0], title: 'Updated Title' };
    mockTaskService.updateTaskTitle.mockResolvedValue(updatedTask);
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await act(async () => {
      await result.current.updateTaskTitle(1, 'Updated Title');
    });
    
    expect(mockTaskService.updateTaskTitle).toHaveBeenCalledWith(1, 'Updated Title');
    expect(result.current.tasks[0].title).toBe('Updated Title');
  });

  it('should update task description', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    const updatedTask = { ...mockTasks[0], description: 'Updated Description' };
    mockTaskService.updateTaskDescription.mockResolvedValue(updatedTask);
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await act(async () => {
      await result.current.updateTaskDescription(1, 'Updated Description');
    });
    
    expect(mockTaskService.updateTaskDescription).toHaveBeenCalledWith(1, 'Updated Description');
    expect(result.current.tasks[0].description).toBe('Updated Description');
  });

  it('should toggle task completion status', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    const updatedTask = { ...mockTasks[0], isCompleted: true };
    mockTaskService.toggleTaskCompletion.mockResolvedValue(updatedTask);
    
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await act(async () => {
      await result.current.toggleTaskCompletion(1, true);
    });
    
    expect(mockTaskService.toggleTaskCompletion).toHaveBeenCalledWith(1, true);
    expect(result.current.tasks[0].isCompleted).toBe(true);
  });
}); 