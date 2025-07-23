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

### Setup & Run
```bash
cd backend
dotnet restore
dotnet run
```

The API will be available with 10 random "Task" records seeded:
- **HTTP**: http://localhost:5209
- **Swagger UI**: http://localhost:5209/swagger

### Run Tests
```bash
cd backend
dotnet test
```

## Frontend (React + Vite)

### Setup & Run

> By default, the frontend will connect to http://localhost:5209. If you updated the host port of the backend, create a `.env` file in the `/frontend` directory with `VITE_API_HOST_URL=http://localhost:{the_new_port}`, prior to running the app.

```bash
cd frontend
yarn install
yarn dev
```

The application will be available at: http://localhost:5173

### Run Tests
```bash
cd frontend
yarn test
```

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
- All CRUD operations on Tasks
- Truncate descriptions larger than 300 characters (100 characters on mobile). Max limit is 1000 characters
- Task list is sorted by pending tasks first
- In-place editing for Task title and description, with edit disabled for completed tasks
- Toggle task completion
- Responsive design

## Database

The application uses SQLite as the database. The database file (`app.db`) is automatically created when you first run the application, with 10 records seeded.

## Design choices, trade-offs, and assumptions made
- Assumed the project to be a To-do list rather than a project management tool.
- Backend is organized with Feature-Folder Architecture to allow fluid scalability by easily adding new features/modules/domains. And potentially breakout modules into microservices when needed.
- For the purpose of this test and the simplicity of the features implemented, although structured logging is enabled, I have excluded logging in the services and controllers.
- For updating a "task", I resorted to exposing a PATCH endpoint, since we will be updating one field at a time - Task Name, Task Description, or toggle a Task as completed.
- Opted for using a custom hook to reduce prop drilling instead of State managers like Context and Zustand, since the component tree is shallow. 
- Opted for not showing success notifications. I think the current UX eliminates the need for it.
- To keep the project scope limited/focused:
   - Added tests for only the critical sections
   - Skipped paginating the task list
   - Skipped error/validation notifications
   - Skipped implementing retry-with-backoff logic for API integration
