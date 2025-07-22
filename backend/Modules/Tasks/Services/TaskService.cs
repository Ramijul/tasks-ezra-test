using backend.Data;
using backend.Modules.Tasks.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Tasks.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
        {
            var tasks = await _context.Tasks
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return tasks.Select(MapToDto);
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            return task != null ? MapToDto(task) : null;
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return null;

            if (updateTaskDto.Title != null)
                task.Title = updateTaskDto.Title;
            
            if (updateTaskDto.Description != null)
                task.Description = updateTaskDto.Description;
            
            if (updateTaskDto.IsCompleted.HasValue)
                task.IsCompleted = updateTaskDto.IsCompleted.Value;

            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true;
        }

        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
} 