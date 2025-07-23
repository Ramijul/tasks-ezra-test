using backend.Modules.Tasks.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace backend.Data
{
    public static class DatabaseSeeder
    {
        private static readonly string[] TaskTitles = {
            "Complete project documentation",
            "Review pull requests",
            "Setup development environment",
            "Write unit tests",
            "Update dependencies",
            "Fix critical bugs",
            "Optimize database queries",
            "Implement new feature",
            "Code review for team member",
            "Deploy to production",
            "Create API documentation",
            "Refactor legacy code",
            "Setup CI/CD pipeline",
            "Security audit",
            "Performance testing",
            "User acceptance testing",
            "Database migration",
            "Backup verification",
            "Monitor system logs",
            "Update deployment scripts"
        };

        private static readonly string[] Descriptions = {
            "Write comprehensive documentation for the new feature including detailed API specifications, usage examples, deployment guides, configuration options, troubleshooting steps, performance considerations, security best practices, integration patterns, database schema details, caching strategies, error handling approaches, logging mechanisms, monitoring recommendations, scalability guidelines, testing strategies, CI/CD pipeline setup, infrastructure requirements, backup and recovery procedures, data migration steps, third-party integrations, authentication flows, authorization rules, rate limiting policies, input validation rules, output formatting, versioning strategy, backwards compatibility notes, known limitations, common pitfalls, FAQs, glossary of terms, architecture diagrams, sequence diagrams, component interactions, data flow descriptions, state management details, event handling patterns, accessibility considerations, internationalization support, browser compatibility notes, mobile responsiveness guidelines, and optimization techniques for maximum performance and user experience.",
            "Go through all pending PRs and provide constructive feedback to team members",
            "Install all necessary development tools and configure the workspace for new team members",
            "Create comprehensive unit tests with good coverage for the new functionality",
            "Update all project dependencies to their latest stable versions and test compatibility",
            "Investigate and fix critical bugs reported by users in the production environment",
            "Analyze and optimize slow database queries to improve application performance",
            "Implement the new user authentication feature with OAuth2 integration",
            "Perform thorough code review for the new team member's first contribution",
            "Deploy the latest version to production environment with proper rollback plan",
            "Create detailed API documentation with examples and error responses",
            "Refactor the old authentication system to use modern security practices",
            "Set up continuous integration and deployment pipeline with automated testing",
            "Conduct security audit of the application and fix any vulnerabilities found",
            "Run performance tests to ensure the application meets response time requirements",
            "Coordinate with stakeholders for user acceptance testing of new features",
            "Execute database migration scripts to update schema for new features",
            "Verify that all backup systems are working correctly and data is recoverable",
            "Monitor system logs for any errors or performance issues in production",
            "Update deployment scripts to include new environment variables and configurations",
            "Implement comprehensive error handling and logging throughout the application including proper exception management, structured logging with correlation IDs, error categorization and severity levels, automated alerting for critical errors, error reporting to external monitoring services, user-friendly error messages for end users, detailed error information for developers, error recovery mechanisms, graceful degradation strategies, circuit breaker patterns for external service calls, retry logic with exponential backoff, dead letter queues for failed operations, error analytics and reporting, performance impact monitoring, security event logging, audit trail maintenance, compliance reporting capabilities, and integration with centralized logging systems for better observability and debugging capabilities."
        };

        public static async Task SeedAsync(ApplicationDbContext context)
        {
            try
            {
                // Check if tasks already exist
                if (await context.Tasks.AnyAsync())
                {
                    Log.Information("Database already contains tasks, skipping seeding");
                    return;
                }

                var random = new Random();
                var tasks = new List<TaskItem>();

                // Generate 10 random tasks
                for (int i = 0; i < 10; i++)
                {
                    var title = TaskTitles[random.Next(TaskTitles.Length)];
                    var description = Descriptions[random.Next(Descriptions.Length)];
                    var isCompleted = random.Next(2) == 1; // 50% chance of being completed
                    
                    // Random creation date within the last 30 days
                    var createdAt = DateTime.UtcNow.AddDays(-random.Next(30));
                    var updatedAt = isCompleted ? createdAt.AddDays(random.Next(1, 10)) : createdAt;

                    var task = new TaskItem
                    {
                        Title = title,
                        Description = description,
                        IsCompleted = isCompleted,
                        CreatedAt = createdAt,
                        UpdatedAt = updatedAt
                    };

                    tasks.Add(task);
                }

                await context.Tasks.AddRangeAsync(tasks);
                await context.SaveChangesAsync();

                Log.Information("Successfully seeded database with {TaskCount} random tasks", tasks.Count);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while seeding database");
                throw;
            }
        }
    }
} 