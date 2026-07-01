# School Facilities Project Report

## 1. Project Overview
School Facilities is a web-based portal designed to help schools manage facility-related issues efficiently. It allows users to report problems such as broken furniture, sanitation concerns, electrical hazards, and maintenance requests, while giving administrators and staff tools to track progress and ensure accountability.

## 2. Objectives
The application aims to:
- Provide a simple interface for reporting facility problems
- Enable tracking of issue status from submission to resolution
- Support role-based access for parents, teachers, and administrators
- Improve communication through notifications and admin oversight
- Create a structured workflow for school maintenance operations

## 3. Project Scope
The current implementation includes:
- A responsive React frontend with Tailwind styling
- Protected routes for authenticated users
- Login and registration flows
- Dashboard and reporting pages
- Issue tracking and notification views
- Admin panel overview and management features
- A Node.js and Express backend with JWT authentication
- A MongoDB-ready backend configuration with an in-memory fallback store

## 4. Architecture
### Frontend
- Built with React and Vite
- Uses React Router for page navigation
- Tailwind CSS provides the visual design system
- API calls are centralized in the client-side API layer

### Backend
- Built with Node.js and Express
- Authentication is handled with JWT tokens
- Routes are organized for authentication, issues, notifications, and admin actions
- Environment variables are loaded using dotenv

### Data Layer
- The project is structured to support MongoDB via Mongoose-style configuration
- It also includes an in-memory fallback store for local development and testing

## 5. Current Features
### User Experience
- Login and registration screens
- Dashboard for issue visibility
- Report issue form
- Tracking page for issue status monitoring
- Notifications panel
- Admin panel for operational oversight

### Security
- Protected routes restrict access to authenticated users
- JWT authentication is used for secured API requests
- Session data is stored client-side for app continuity

## 6. Development Setup
### Prerequisites
- Node.js installed
- npm installed

### Installation
1. Install dependencies in the project root, client, and server directories.
2. Create or update environment variables in server/.env.
3. Ensure the server has a valid JWT secret value.

### Environment Variables
- JWT_SECRET: used for signing authentication tokens
- MONGO_URI: database connection string for production or development database use

## 7. Running the Project
Use the available scripts in the project package files to start the frontend and backend locally.

## 8. Current Status Summary
The project is in a functional prototype stage with a polished UI and core workflows implemented. It provides a strong foundation for further enhancement, including real database persistence, richer admin controls, and expanded notification systems.

## 9. Recommended Next Steps
- Connect the backend fully to MongoDB
- Add stronger validation and error handling
- Improve admin actions and reporting analytics
- Expand notification and escalation logic
- Add automated tests for authentication and issue management

## 10. Conclusion
School Facilities provides a practical and scalable foundation for digital maintenance and facility reporting in schools. Its modular structure makes it suitable for future expansion into a full production-grade school operations platform.
