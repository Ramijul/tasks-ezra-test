using Microsoft.EntityFrameworkCore;
using backend.Modules.Tasks.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply TaskItem configuration from Tasks module
            modelBuilder.ApplyConfiguration(new backend.Modules.Tasks.Models.TaskConfiguration());
        }
    }
} 