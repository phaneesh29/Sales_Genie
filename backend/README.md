# Backend (Node.js)

This folder contains the backend server for the AI SDR project. It is built with Node.js and Express, and handles API endpoints, database operations, authentication, and business logic.

## Structure

- `.env` / `.env.sample`: Environment variable configuration files.
- `constants.js`: Application-wide constants.
- `index.js`: Entry point for the backend server.
- `package.json`: Project dependencies and scripts.
- `seeder.js`: Script for seeding the database with initial data.

### Folders
- `controllers/`: Route handler logic for different resources (admin, email, health, lead).
- `crons/`: Scheduled jobs for handling leads.
- `db/`: Database configuration and connection logic.
- `logs/`: Log files for combined and error logs.
- `middlewares/`: Express middleware for authentication and other purposes.
- `models/`: Database models (email, leads, user).
- `routes/`: Express route definitions for different resources.
- `uploads/`: Directory for file uploads.
- `utils/`: Utility functions and services (AI, email, helpers, logger).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.sample` to `.env` and fill in required environment variables.
3. Start the server:
   ```bash
   npm start
   ```

## Main Features
- Admin and lead management
- Email sending and tracking
- Health check endpoint
- AI-powered services
- Cron jobs for lead processing
- Logging and error handling

## Scripts
- `npm start`: Start the backend server
- `npm run seed`: Seed the database

## Notes
- Ensure MongoDB or your configured database is running.
- Logs are stored in the `logs/` directory.
- Uploaded files are stored in the `uploads/` directory.
