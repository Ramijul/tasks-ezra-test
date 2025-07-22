using System.ComponentModel.DataAnnotations;

namespace backend.Modules.Tasks.Models
{
    public class TaskDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        public bool IsCompleted { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateTaskDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
    }

    public class UpdateTaskDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        public bool? IsCompleted { get; set; }
    }
} 