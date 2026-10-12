# SkillBridge — MERN Full-Stack Starter

SkillBridge connects people who want to teach, learn, exchange skills, and contribute to community projects.

## Features
- JWT authentication (register/login)
- User profiles with offered and wanted skills
- Explore/search community members
- Skill-match scoring
- Create and browse community projects
- Apply to projects
- Create skill-exchange requests
- Dashboard summary
- Responsive React UI
- Express + MongoDB API
- Seed demo data
- Optional AI learning-path endpoint (uses OpenAI-compatible API only when configured)

## Stack
- MongoDB + Mongoose
- Express.js / Node.js
- React + Vite
- React Router
- Axios
- JWT + bcrypt
- CSS (responsive)

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas URI

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```
Edit `server/.env` and set `MONGO_URI` and `JWT_SECRET`.

API runs at `http://localhost:5000`.

### 2. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Demo account
After running `npm run seed`:
- Email: `demo@skillbridge.local`
- Password: `SkillBridge123!`

The seed script creates sample users and projects. It will not delete existing data.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/me`
- `GET /api/matches`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:id/apply`
- `GET /api/projects/mine`
- `POST /api/exchanges`
- `GET /api/exchanges/mine`
- `PATCH /api/exchanges/:id/status`
- `GET /api/dashboard`
- `POST /api/ai/learning-path`

## Notes
- This is a runnable student-project starter, not a production-hardened service.
- AI learning-path generation falls back to a built-in rule-based response if no AI API key is configured.
- For production, add email verification, password reset, rate limiting, moderation, tests, audit logging, and stronger validation.
