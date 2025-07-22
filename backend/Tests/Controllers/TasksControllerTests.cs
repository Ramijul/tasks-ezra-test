using backend.Modules.Tasks.Models;
using backend.Modules.Tasks.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;

namespace backend.Tests.Controllers
{
    public class TasksControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly Mock<ITaskService> _mockTaskService;

        public TasksControllerTests(WebApplicationFactory<Program> factory)
        {
            _mockTaskService = new Mock<ITaskService>();
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.UseContentRoot(Directory.GetCurrentDirectory());
                builder.ConfigureServices(services =>
                {
                    // Replace the real service with the mock
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(ITaskService));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }
                    services.AddScoped<ITaskService>(_ => _mockTaskService.Object);
                });
            });
        }

        [Fact]
        public async Task GetTasks_ShouldReturnAllTasks()
        {
            // Arrange
            var expectedTasks = new List<TaskDto>
            {
                new() { Id = 1, Title = "Task 1", Description = "Description 1", IsCompleted = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Id = 2, Title = "Task 2", Description = "Description 2", IsCompleted = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };

            _mockTaskService.Setup(x => x.GetAllTasksAsync())
                .ReturnsAsync(expectedTasks);

            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/tasks");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            var tasks = JsonSerializer.Deserialize<List<TaskDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            tasks.Should().HaveCount(2);
            tasks![0].Title.Should().Be("Task 1");
            tasks[1].Title.Should().Be("Task 2");
        }

        [Fact]
        public async Task GetTask_WithValidId_ShouldReturnTask()
        {
            // Arrange
            var expectedTask = new TaskDto
            {
                Id = 1,
                Title = "Test Task",
                Description = "Test Description",
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockTaskService.Setup(x => x.GetTaskByIdAsync(1))
                .ReturnsAsync(expectedTask);

            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/tasks/1");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            var task = JsonSerializer.Deserialize<TaskDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            task.Should().NotBeNull();
            task!.Title.Should().Be("Test Task");
            task.Description.Should().Be("Test Description");
        }

        [Fact]
        public async Task GetTask_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockTaskService.Setup(x => x.GetTaskByIdAsync(999))
                .ReturnsAsync((TaskDto?)null);

            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/tasks/999");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task CreateTask_ShouldCreateAndReturnTask()
        {
            // Arrange
            var createDto = new CreateTaskDto
            {
                Title = "New Task",
                Description = "New Description"
            };

            var createdTask = new TaskDto
            {
                Id = 1,
                Title = "New Task",
                Description = "New Description",
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockTaskService.Setup(x => x.CreateTaskAsync(It.IsAny<CreateTaskDto>()))
                .ReturnsAsync(createdTask);

            var client = _factory.CreateClient();
            var json = JsonSerializer.Serialize(createDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/tasks", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var responseContent = await response.Content.ReadAsStringAsync();
            var task = JsonSerializer.Deserialize<TaskDto>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            task.Should().NotBeNull();
            task!.Title.Should().Be("New Task");
            task.Description.Should().Be("New Description");
        }

        [Fact]
        public async Task UpdateTask_WithValidId_ShouldUpdateAndReturnTask()
        {
            // Arrange
            var updateDto = new UpdateTaskDto
            {
                Title = "Updated Task",
                Description = "Updated Description",
                IsCompleted = true
            };

            var updatedTask = new TaskDto
            {
                Id = 1,
                Title = "Updated Task",
                Description = "Updated Description",
                IsCompleted = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockTaskService.Setup(x => x.UpdateTaskAsync(1, It.IsAny<UpdateTaskDto>()))
                .ReturnsAsync(updatedTask);

            var client = _factory.CreateClient();
            var json = JsonSerializer.Serialize(updateDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await client.PutAsync("/api/tasks/1", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseContent = await response.Content.ReadAsStringAsync();
            var task = JsonSerializer.Deserialize<TaskDto>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            task.Should().NotBeNull();
            task!.Title.Should().Be("Updated Task");
            task.IsCompleted.Should().BeTrue();
        }

        [Fact]
        public async Task UpdateTask_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            var updateDto = new UpdateTaskDto
            {
                Title = "Updated Task"
            };

            _mockTaskService.Setup(x => x.UpdateTaskAsync(999, It.IsAny<UpdateTaskDto>()))
                .ReturnsAsync((TaskDto?)null);

            var client = _factory.CreateClient();
            var json = JsonSerializer.Serialize(updateDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await client.PutAsync("/api/tasks/999", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task DeleteTask_WithValidId_ShouldDeleteAndReturnNoContent()
        {
            // Arrange
            _mockTaskService.Setup(x => x.DeleteTaskAsync(1))
                .ReturnsAsync(true);

            var client = _factory.CreateClient();

            // Act
            var response = await client.DeleteAsync("/api/tasks/1");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task DeleteTask_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockTaskService.Setup(x => x.DeleteTaskAsync(999))
                .ReturnsAsync(false);

            var client = _factory.CreateClient();

            // Act
            var response = await client.DeleteAsync("/api/tasks/999");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
} 