import { describe, it, expect, vi, beforeEach } from "vitest";
import taskService from "../TaskService";
import type { Task, CreateTaskDto } from "../../types/Task";

// Mock fetch globally
(globalThis as any).fetch = vi.fn();

describe("TaskService", () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Test Task 1",
      description: "Test Description 1",
      isCompleted: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      title: "Test Task 2",
      description: "Test Description 2",
      isCompleted: true,
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all tasks successfully", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockTasks),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.getAllTasks();

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    expect(result).toEqual(mockTasks);
  });

  it("should fetch a single task successfully", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockTasks[0]),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.getTaskById(1);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    expect(result).toEqual(mockTasks[0]);
  });

  it("should create a task successfully", async () => {
    const newTask: CreateTaskDto = {
      title: "New Task",
      description: "New Description",
    };
    const createdTask: Task = {
      id: 3,
      ...newTask,
      isCompleted: false,
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-03T00:00:00Z",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(createdTask),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.createTask(newTask);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
    );
    expect(result).toEqual(createdTask);
  });

  it("should update a task successfully", async () => {
    const updates = { title: "Updated Title" };
    const updatedTask = { ...mockTasks[0], ...updates };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(updatedTask),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.updateTask(1, updates);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
    );
    expect(result).toEqual(updatedTask);
  });

  it("should delete a task successfully", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    await taskService.deleteTask(1);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  it("should toggle task completion successfully", async () => {
    const updatedTask = { ...mockTasks[0], isCompleted: true };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(updatedTask),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.toggleTaskCompletion(1, true);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ isCompleted: true }),
      })
    );
    expect(result).toEqual(updatedTask);
  });

  it("should update task title successfully", async () => {
    const updatedTask = { ...mockTasks[0], title: "New Title" };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(updatedTask),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.updateTaskTitle(1, "New Title");

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ title: "New Title" }),
      })
    );
    expect(result).toEqual(updatedTask);
  });

  it("should update task description successfully", async () => {
    const updatedTask = { ...mockTasks[0], description: "New Description" };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(updatedTask),
    };
    ((globalThis as any).fetch as any).mockResolvedValue(mockResponse);

    const result = await taskService.updateTaskDescription(
      1,
      "New Description"
    );

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      "http://localhost:5209/api/tasks/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ description: "New Description" }),
      })
    );
    expect(result).toEqual(updatedTask);
  });
});
