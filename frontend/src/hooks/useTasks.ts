import { useState, useEffect, useCallback } from "react";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";
import taskService from "../services/TaskService";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskDto) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  updateTaskTitle: (id: number, title: string) => Promise<void>;
  updateTaskDescription: (id: number, description: string) => Promise<void>;
  toggleTaskCompletion: (id: number, isCompleted: boolean) => Promise<void>;
}

/**
 * A hook that provides a list of tasks and functions for CRUD operations on tasks.
 *
 * Contains separate update functions for each field of the task object to avoid
 * mistakenly updating a field differently than intended.
 *
 * @returns An object containing the tasks, loading state, error, and functions to create, delete, and update tasks
 */
export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (taskData: CreateTaskDto): Promise<Task> => {
      try {
        setError(null);
        const newTask = await taskService.createTask(taskData);
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create task";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateTaskTitle = useCallback(
    async (id: number, title: string): Promise<void> => {
      try {
        setError(null);
        const updatedTask = await taskService.updateTaskTitle(id, title);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task title";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const updateTaskDescription = useCallback(
    async (id: number, description: string): Promise<void> => {
      try {
        setError(null);
        const updatedTask = await taskService.updateTaskDescription(
          id,
          description
        );
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update task description";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const toggleTaskCompletion = useCallback(
    async (id: number, isCompleted: boolean): Promise<void> => {
      try {
        setError(null);
        const updatedTask = await taskService.toggleTaskCompletion(
          id,
          isCompleted
        );
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to toggle task completion";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  return {
    tasks,
    loading,
    error,
    refreshTasks,
    createTask,
    deleteTask,
    updateTaskTitle,
    updateTaskDescription,
    toggleTaskCompletion,
  };
};
