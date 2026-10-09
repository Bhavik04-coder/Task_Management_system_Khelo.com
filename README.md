# Task Management System

A full-stack task management application with user authentication, task CRUD operations, and a modern UI.

## Tech Stack

**Backend:**
- Python 3.11+ with FastAPI
- SQLAlchemy 2.0 (ORM)
- MySQL 8.0
- Alembic (migrations)
- JWT authentication
- Bcrypt password hashing

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router v6

## Features

- User registration and JWT authentication
- Create, read, update, delete tasks
- Task filtering by status, priority, due date
- Search tasks by title/description
- Dashboard with task statistics
- Responsive design (mobile, tablet, desktop)

## Project Structure

```
task-management-system/
├── backend/                 # Python FastAPI backend
│   ├── alembic/            # Database migrations
│   ├── app/
│   │   ├── config/         # Settings
│   │   ├── controllers/    # Request handlers
│   │   ├── database/       # DB connection
│   │   ├── helpers/        # JWT, password, response helpers
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth & Toast context
│   │   ├── pages/          # Page components
│   │   └── services/       # API service layer
│   └── package.json
└── postman/                # API collection
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Mac/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

5. Create database:
```sql
CREATE DATABASE task_management_db;
```

6. Run migrations:
```bash
alembic upgrade head
```

7. Start server:
```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Swagger docs: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Default: VITE_API_BASE_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### User Profile
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/{id}` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/status` - Update task status only
- `DELETE /api/tasks/{id}` - Delete task

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email (indexed)
- `password_hash` - Bcrypt hashed password
- `created_at`, `updated_at` - Timestamps

### Tasks Table
- `id` - Primary key
- `title` - Task title
- `description` - Task description (optional)
- `status` - Pending | In Progress | Completed
- `priority` - Low | Medium | High
- `due_date` - Due date (optional)
- `user_id` - Foreign key to users
- `created_at`, `updated_at` - Timestamps

**Relationship:** One user has many tasks (1:N with CASCADE delete)

## Postman Collection

Import the collection from `postman/` folder:
1. Open Postman
2. Import `Task-Management.postman_collection.json`
3. Import `Task-Management.postman_environment.json`
4. Select the environment and start testing

The login endpoint automatically saves the JWT token for authenticated requests.

## Environment Variables

### Backend (.env)
```ini
APP_NAME=Task Management API
APP_ENV=development
APP_DEBUG=True
APP_PORT=8000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management_db

JWT_SECRET_KEY=your_secret_key_min_32_chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```ini
VITE_API_BASE_URL=http://localhost:8000/api
```




## Database Verification

### Where is the database stored?

Your SQLite database is located at:
```
backend/task_management.db
```

This file is created automatically when you run `alembic upgrade head`.

### How to check your data

**Method 1: Using the Python Script (Easiest)**

Run this command from the backend directory:
```bash
cd backend
python view_database.py
```

This will show:
- All registered users
- All tasks
- Statistics (total users, tasks, status breakdown)

**Method 2: Using SQLite Command Line**

If you have SQLite installed:
```bash
cd backend
sqlite3 task_management.db
```

Then run SQL queries:
```sql
-- View all users
SELECT * FROM users;

-- View all tasks
SELECT * FROM tasks;

-- View tasks with user info
SELECT t.*, u.name as user_name 
FROM tasks t 
JOIN users u ON t.user_id = u.id;

-- Exit
.quit
```

**Method 3: Using DB Browser for SQLite (GUI)**

1. Download [DB Browser for SQLite](https://sqlitebrowser.org/dl/)
2. Install and open it
3. Click "Open Database"
4. Navigate to `backend/task_management.db`
5. Browse tables visually

### When you add data in the app:

1. **Register a user** → Saved to `users` table
2. **Create a task** → Saved to `tasks` table
3. **Update/Delete** → Changes reflected in database immediately

The database file size will grow as you add more data.

### Database Tables:

- **users** - Stores user accounts (id, name, email, password_hash, timestamps)
- **tasks** - Stores tasks (id, title, description, status, priority, due_date, user_id, timestamps)
- **alembic_version** - Tracks database migrations
