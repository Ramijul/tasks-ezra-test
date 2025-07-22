using backend.Data;
using backend.Modules.Tasks.Models;
using backend.Modules.Tasks.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace backend.Tests.Services
{
    public class TaskServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public TaskServiceTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task GetAllTasksAsync_ShouldReturnAllTasks()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var tasks = new List<TaskItem>
            {
                new() { Title = "Task 1", Description = "Description 1", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Title = "Task 2", Description = "Description 2", IsCompleted = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };

            context.Tasks.AddRange(tasks);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllTasksAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Should().BeInDescendingOrder(x => x.CreatedAt);
        }

        [Fact]
        public async Task GetTaskByIdAsync_WithValidId_ShouldReturnTask()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var task = new TaskItem { Title = "Test Task", Description = "Test Description", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetTaskByIdAsync(task.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Title.Should().Be("Test Task");
            result.Description.Should().Be("Test Description");
            result.IsCompleted.Should().BeFalse();
        }

        [Fact]
        public async Task GetTaskByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            // Act
            var result = await service.GetTaskByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task CreateTaskAsync_ShouldCreateAndReturnTask()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var createDto = new CreateTaskDto
            {
                Title = "New Task",
                Description = "New Description"
            };

            // Act
            var result = await service.CreateTaskAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be("New Task");
            result.Description.Should().Be("New Description");
            result.IsCompleted.Should().BeFalse();
            result.Id.Should().BeGreaterThan(0);

            // Verify it was saved to database
            var savedTask = await context.Tasks.FindAsync(result.Id);
            savedTask.Should().NotBeNull();
            savedTask!.Title.Should().Be("New Task");
        }

        [Fact]
        public async Task UpdateTaskAsync_WithValidId_ShouldUpdateAndReturnTask()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var task = new TaskItem { Title = "Original Title", Description = "Original Description", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            var updateDto = new UpdateTaskDto
            {
                Title = "Updated Title",
                Description = "Updated Description",
                IsCompleted = true
            };

            // Act
            var result = await service.UpdateTaskAsync(task.Id, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.Title.Should().Be("Updated Title");
            result.Description.Should().Be("Updated Description");
            result.IsCompleted.Should().BeTrue();

            // Verify it was updated in database
            var updatedTask = await context.Tasks.FindAsync(task.Id);
            updatedTask.Should().NotBeNull();
            updatedTask!.Title.Should().Be("Updated Title");
        }

        [Fact]
        public async Task UpdateTaskAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var updateDto = new UpdateTaskDto
            {
                Title = "Updated Title"
            };

            // Act
            var result = await service.UpdateTaskAsync(999, updateDto);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task UpdateTaskAsync_WithPartialUpdate_ShouldUpdateOnlyProvidedFields()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var task = new TaskItem { Title = "Original Title", Description = "Original Description", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            var updateDto = new UpdateTaskDto
            {
                Title = "Updated Title"
                // Description and IsCompleted not provided
            };

            // Act
            var result = await service.UpdateTaskAsync(task.Id, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.Title.Should().Be("Updated Title");
            result.Description.Should().Be("Original Description"); // Should remain unchanged
            result.IsCompleted.Should().BeFalse(); // Should remain unchanged
        }

        [Fact]
        public async Task DeleteTaskAsync_WithValidId_ShouldDeleteAndReturnTrue()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            var task = new TaskItem { Title = "Task to Delete", Description = "Description", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteTaskAsync(task.Id);

            // Assert
            result.Should().BeTrue();

            // Verify it was deleted from database
            var deletedTask = await context.Tasks.FindAsync(task.Id);
            deletedTask.Should().BeNull();
        }

        [Fact]
        public async Task DeleteTaskAsync_WithInvalidId_ShouldReturnFalse()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new TaskService(context);

            // Act
            var result = await service.DeleteTaskAsync(999);

            // Assert
            result.Should().BeFalse();
        }
    }
} 