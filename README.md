# Foundry — MERN Job Board

https://ckn060497.github.io/jobboard/frontend/

A full-stack job board built with MongoDB, Express, React, and Node.js.
Three roles are supported: **Job Seeker**, **Employer**, and **Admin**.
Authentication supports email/password (JWT) and **Google OAuth 2.0**.

## Features

- Job seekers: browse/search/filter jobs, upload a resume and apply, track application status
- Employers: post jobs, edit/close/delete listings, review applicants, update applicant status
- Admins: view platform stats, activate/deactivate users, approve/unapprove job listings
- JWT-based auth + "Continue with Google" sign in
- Full-text job search (title, description, skills, company) with filters for location, type, and experience level
- Resume uploads handled via Multer, served statically

## Project structure

```
jobboard/
  backend/     Express API, MongoDB models, JWT + Google OAuth, file uploads
  frontend/    React (Vite) + Tailwind CSS client
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — point at your local MongoDB or a MongoDB Atlas connection string
- `JWT_SECRET` / `SESSION_SECRET` — set to long random strings
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — create OAuth credentials at
  https://console.cloud.google.com/apis/credentials (Authorized redirect URI:
  `http://localhost:5000/api/auth/google/callback`)

Run the API:

```bash
npm run dev      # nodemon, http://localhost:5000
```

Optional: seed an admin account (reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env, or uses defaults):

```bash
node seed/createAdmin.js
```

Default admin login if you don't set env vars: `admin@jobboard.com` / `Admin@12345`

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra
CORS configuration is needed in development.

## 3. Try it out

1. Register as an **Employer**, post a job.
2. Register as a **Job Seeker** (or sign in with Google), browse `/jobs`, and apply with a resume.
3. Log in as the seeded **Admin** to view stats and moderate users/jobs.

## Notes on Google OAuth

The OAuth flow is fully wired: clicking "Continue with Google" hits
`GET /api/auth/google`, completes on Google's consent screen, and redirects to
`GET /api/auth/google/callback`, which issues a JWT and redirects the browser to
`http://localhost:5173/oauth-success?token=...`. The frontend then stores that
token the same way as a normal email/password login. You only need to supply
valid Google API credentials in the backend `.env` for this to work end to end.

## Tech stack

- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Passport (Google OAuth20), Multer, bcryptjs
- **Frontend:** React 18, React Router, Axios, Tailwind CSS, Vite
