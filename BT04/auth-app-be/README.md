# Auth App Backend

Backend API for authentication application using Express.js, Sequelize, and MySQL.

## Features

- User Registration
- User Login
- Forgot Password
- User Logout
- JWT Authentication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure database in `.env` file

3. Create database:

```sql
CREATE DATABASE auth_app_db;
```

4. Run the server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Reset password
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info (protected)
