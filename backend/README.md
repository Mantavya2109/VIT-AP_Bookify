# Bookify Backend

Express + TypeScript API for Bookify.

For the full monorepo setup (frontend + database + Clerk), see the root README.

---

## Prerequisites

- Node.js >= 20
- PostgreSQL database (local or hosted)

---

## Environment Variables

Create **backend/.env**:

```bash
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
FRONTEND_URL=http://localhost:5173

CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

NODE_ENV=development
```

---

## Install

From the repo root:

```bash
npm install --prefix backend
```

---

## Database (Drizzle)

Push the schema in backend/src/db/schema.ts to your Postgres DB:

```bash
npm run db:push --prefix backend
```

---

## Run (dev)

```bash
npm run dev --prefix backend
```

Health check:

- GET http://localhost:5000/api/health

---

## Build / Start

```bash
npm run build --prefix backend
npm run start --prefix backend
```
