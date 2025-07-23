import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";

const { env } = import.meta;

const API_BASE_URL = `${
  env.VITE_API_HOST_URL || "http://localhost:5209"
}/api/tasks`;

class TaskService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like DELETE requests)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>("");
  }

  // Get a single task by ID
  async getTaskById(id: number): Promise<Task> {
    return this.request<Task>(`/${id}`);
  }

  // Create a new task
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    return this.request<Task>("", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  // Update a task
  async updateTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
    return this.request<Task>(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(taskData),
    });
  }

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/${id}`, {
      method: "DELETE",
    });
  }

  // Toggle task completion status
  async toggleTaskCompletion(id: number, isCompleted: boolean): Promise<Task> {
    return this.updateTask(id, { isCompleted });
  }

  // Update task title
  async updateTaskTitle(id: number, title: string): Promise<Task> {
    return this.updateTask(id, { title });
  }

  // Update task description
  async updateTaskDescription(id: number, description: string): Promise<Task> {
    return this.updateTask(id, { description });
  }
}

// Export a singleton instance
export const taskService = new TaskService();
export default taskService;
