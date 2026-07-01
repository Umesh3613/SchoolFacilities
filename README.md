# School Facility Condition Reporting & Repair Tracking Portal

React + Tailwind frontend with a Node.js + Express backend and MongoDB-ready data layer for reporting and tracking school facility issues.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, JWT auth, in-memory fallback store
- Database: MongoDB via Mongoose-ready configuration

## Run locally

1. Install dependencies in the root, `client`, and `server` folders.
2. Set `MONGO_URI` and `JWT_SECRET` in `server/.env`.
3. Run `npm run dev` from the repository root.

## Key pages

- Login and registration
- Dashboard
- Issue reporting
- Repair tracking
- Notifications
- Admin panel
