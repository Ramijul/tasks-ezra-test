# Tasks Application

A full-stack task management application built with ASP.NET Core backend and React frontend.

## Project Structure

```
tasks-ezra-test/
├── backend/          # ASP.NET Core Web API
├── frontend/         # React + Vite application
└── README.md         # This file
```

## Prerequisites

- **.NET 8.0 SDK** - For the backend
- **Node.js 22+** - For the frontend (required for Tailwind CSS v4)
- **npm** or **yarn** (recommended) - Package manager for frontend

## Backend (ASP.NET Core)

### Setup
```bash
cd backend
dotnet restore
```

### Run the Application
```bash
cd backend
dotnet run
```

The API will be available at:
- **HTTP**: http://localhost:5209
- **Swagger UI**: http://localhost:5209/swagger

### Run Tests
```bash
cd backend
dotnet test
```

For verbose output:
```bash
dotnet test --verbosity normal
```

### Health Check
Check application health at: `/health`

## Frontend (React + Vite)

### Setup
```bash
cd frontend
npm install
```

### Run the Application
```bash
cd frontend
npm run dev
```

The application will be available at: http://localhost:5173

### Build for Production
```bash
cd frontend
npm run build
```

### Preview Production Build
```bash
cd frontend
npm run preview
```

## Development Workflow

### Starting Both Applications

1. **Start the Backend** (Terminal 1):
   ```bash
   cd backend
   dotnet run
   ```

2. **Start the Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - API Documentation: http://localhost:5209/swagger

### Running Tests

**Backend Tests**:
```bash
cd backend
dotnet test
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /health` - Health check endpoint

## Features

### Backend
- **ASP.NET Core 8.0** Web API
- **Entity Framework Core** with SQLite database
- **Serilog** structured logging
- **Health checks** for monitoring
- **Swagger/OpenAPI** documentation
- **CORS** configured for frontend
- **Comprehensive testing** with xUnit, Moq, and FluentAssertions

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **ESLint** for code quality

## Database

The application uses SQLite as the database. The database file (`app.db`) is automatically created when you first run the application.

## Logging

The backend uses Serilog for structured logging:
- Console output for development
- File logging with daily rotation (`logs/app-YYYY-MM-DD.txt`)
- Request logging middleware

## Testing

### Backend Testing
- **Unit Tests**: Service layer with mocked dependencies
- **Integration Tests**: Controller layer with mocked services
- **Database Tests**: Using Entity Framework In-Memory provider

### Test Coverage
- All CRUD operations for tasks
- Error scenarios and edge cases
- HTTP status codes and responses
- Database operations

## Troubleshooting

### Common Issues

**Backend won't start**:
- Ensure .NET 8.0 SDK is installed
- Run `dotnet restore` in the backend directory
- Check if port 5209 is available

**Frontend won't start**:
- Ensure Node.js 22+ is installed (required for Tailwind CSS v4)
- Run `npm install` in the frontend directory
- Check if port 5173 is available

**Tests failing**:
- Ensure all dependencies are installed
- Run `dotnet restore` in the backend directory
- Check for any build errors first

### Port Conflicts

If you encounter port conflicts, you can:

**Backend**: Modify ports in `backend/Properties/launchSettings.json`
**Frontend**: Use `npm run dev -- --port 3000` to specify a different port
