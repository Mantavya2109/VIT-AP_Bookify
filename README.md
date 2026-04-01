# Bookify Full Stack (Monorepo)

# Hosted- https://vit-ap-bookify-1.onrender.com

Bookify is a full‑stack app where users can sign in (Clerk), create “Book” listings (stored as `products` in the backend), view all listings, and comment on listings.

This repo contains:

- **frontend/** — React + Vite UI
- **backend/** — Express + TypeScript API + Drizzle ORM (PostgreSQL)

---

## Tech Stack

**Frontend**

- React (Vite)
- Tailwind CSS + DaisyUI
- React Router
- TanStack Query
- Clerk (auth)

**Backend**

- Node.js + Express
- TypeScript
- Clerk (auth middleware)
- Drizzle ORM + `pg` (PostgreSQL)

**Database**

- PostgreSQL
- Drizzle schema: backend/src/db/schema.ts

---

## Prerequisites

- **Node.js >= 20** (see root package.json `engines.node`)
- **npm** (comes with Node)
- **PostgreSQL database** (local or hosted)
- **Clerk account + application** (publishable + secret keys)

---

## Environment Variables

You’ll configure environment variables separately for the backend and frontend.

### Backend env (backend/.env)

Create a file at **backend/.env**:

```bash
PORT=5000

# PostgreSQL connection string
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME

# CORS: must match the frontend origin exactly
FRONTEND_URL=http://localhost:5173

# Clerk (server)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

NODE_ENV=development
```

Notes:

- The backend will throw on startup if `DATABASE_URL` is missing.
- `FRONTEND_URL` is used by CORS and must match your actual frontend URL.

### Frontend env (frontend/.env.local)

Create a file at **frontend/.env.local**:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Notes:

- The frontend throws on startup if `VITE_CLERK_PUBLISHABLE_KEY` is missing.
- `VITE_API_URL` must include `/api` because the backend mounts routes under that prefix.

---

## Database Setup (PostgreSQL + Drizzle)

### 1) Create a database

Use any PostgreSQL provider:

- Local PostgreSQL (recommended for development)
- Hosted PostgreSQL (Neon, Supabase, Railway, Render, etc.)

Then set `DATABASE_URL` in **backend/.env**.

Example hosted connection strings often require SSL, e.g.:

```text
postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require
```

### 2) Push schema

Drizzle uses the schema defined in **backend/src/db/schema.ts** and the Drizzle config in **backend/drizzle.config.ts**.

Run:

```bash
npm run db:push --prefix backend
```

This will create/update the tables in your Postgres database.

---

## Install Dependencies

From the repo root:

```bash
npm install --prefix backend
npm install --prefix frontend
```

---

## Run in Development (2 terminals)

### Terminal 1 — Backend API

```bash
npm run dev --prefix backend
```

The backend serves on:

- `http://localhost:5000` (if `PORT=5000`)
- Health check: `GET /api/health`

### Terminal 2 — Frontend

```bash
npm run dev --prefix frontend
```

Vite defaults to:

- `http://localhost:5173`

---

## Production Build / Run

### Build everything

From the repo root:

```bash
npm run build
```

This runs installs (if needed) and builds:

- Frontend: `npm run build --prefix frontend`
- Backend: `npm run build --prefix backend` (TypeScript → dist)

### Start backend (root script)

```bash
npm start
```

Root `start` will:

1. Run `npm run db:push --prefix backend`
2. Start the backend with `npm run start --prefix backend`

Important:

- This does **not** serve the frontend. In production you typically deploy the frontend separately (static hosting) or run `npm run preview --prefix frontend`.

---

## API Overview

Base URL: `${VITE_API_URL}` (example: `http://localhost:5000/api`)

### Health

- `GET /health` — lists available route groups

### Users

- `POST /users/sync` (protected) — upserts the current Clerk user into the DB

### Products (Books)

- `GET /products` (public) — list all
- `GET /products/:id` (public) — detail (includes comments + user)
- `GET /products/my` (protected) — list current user’s products
- `POST /products` (protected) — create
- `PUT /products/:id` (protected) — update (owner only)
- `DELETE /products/:id` (protected) — delete (owner only)

### Comments

- `POST /comments/:productId` (protected) — add comment
- `DELETE /comments/:commentId` (protected) — delete (owner only)

Auth notes:

- The frontend attaches a Clerk token as `Authorization: Bearer <token>`.
- The backend uses Clerk middleware and `requireAuth()` on protected routes.

---

## Database Schema (High level)

Defined in **backend/src/db/schema.ts**:

- `users` — Clerk user id (text primary key), email, name, image_url, timestamps
- `products` — uuid id, title, description, image_url, user_id (FK → users)
- `comments` — uuid id, content, user_id (FK), product_id (FK), created_at

---

## Common Troubleshooting

**CORS errors in the browser**

- Ensure `FRONTEND_URL` in **backend/.env** matches the exact origin running Vite (usually `http://localhost:5173`).
- Restart the backend after env changes.

**Frontend crashes with “Missing Publishable Key”**

- Set `VITE_CLERK_PUBLISHABLE_KEY` in **frontend/.env.local**.
- Restart the frontend dev server.

**Backend crashes: `DATABASE_URL is not defined`**

- Set `DATABASE_URL` in **backend/.env**.
- Verify the database is reachable.

**Tables missing**

- Run `npm run db:push --prefix backend` after setting `DATABASE_URL`.

---

## Repo Structure (quick map)

```text
backend/
  src/
    index.ts              # Express app entry
    config/env.ts         # dotenv + ENV
    db/                   # Drizzle schema + db client + queries
    controllers/          # route handlers
    routes/               # express routers mounted under /api

frontend/
  src/
    main.jsx              # ClerkProvider + Router + QueryClient
    lib/axios.js          # axios baseURL from VITE_API_URL
    lib/api.js            # API functions
    hooks/                # react-query hooks
    pages/                # routes (Home/Product/Profile/Create/Edit)
    components/           # Navbar, cards, forms, theme selector
```
