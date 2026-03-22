# Bookify Frontend

React + Vite frontend for Bookify.

For the full monorepo setup (backend + database + Clerk), see the root README.

---

## Prerequisites

- Node.js >= 20

---

## Environment Variables

Create **frontend/.env.local**:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Install

From the repo root:

```bash
npm install --prefix frontend
```

---

## Run (dev)

```bash
npm run dev --prefix frontend
```

---

## Build

```bash
npm run build --prefix frontend
```

## Preview production build

```bash
npm run preview --prefix frontend
```
