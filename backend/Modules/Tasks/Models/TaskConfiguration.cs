using backend.Modules.Tasks.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Tasks.Models
{
    public class TaskConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> entity)
        {
            entity.ToTable("tasks");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200).HasColumnName("title");
            entity.Property(e => e.Description).HasMaxLength(1000).HasColumnName("description");
            entity.Property(e => e.IsCompleted).HasColumnName("is_completed");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("updated_at");
        }
    }
} 