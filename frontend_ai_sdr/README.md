
# Frontend (AI SDR)

This folder contains the frontend application for the AI SDR project. It is built with React and Vite, providing a fast and modern user interface for managing leads, admins, and meetings.

## Structure

- `.env`: Environment variable configuration for the frontend.
- `index.html`: Main HTML file.
- `package.json`: Project dependencies and scripts.
- `vite.config.js`: Vite configuration.
- `vercel.json`: Vercel deployment configuration.
- `eslint.config.js`: ESLint configuration for code quality.

### Folders
- `public/`: Static assets (e.g., images, icons).
- `src/`: Source code for the React application.
  - `api/`: Axios instance and API utilities.
  - `components/`: Reusable React components (e.g., Loader, SideNavDash).
  - `pages/`: Main pages for the app (AddLead, AdminDashboard, AdminLogin, etc.).
  - `index.css`: Global styles.
  - `App.jsx`: Main app component.
  - `main.jsx`: Entry point for React.

## Setup

1. Install dependencies:
	```bash
	npm install
	```
2. Copy `.env` and configure environment variables as needed.
3. Start the development server:
	```bash
	npm run dev
	```

## Main Features
- Admin authentication and registration
- Lead management and search
- Meeting scheduling and management
- Workflow editing
- Responsive dashboard UI

## Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm run preview`: Preview the production build

## Notes
- The app communicates with the backend API for data operations.
- Make sure the backend server is running for full functionality.
- Deployment is configured for Vercel in `vercel.json`.
