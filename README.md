# 🏋️‍♂️ Argon — Gym Management System

A full-stack gym management app: Node.js + Express + Sequelize backend, React + Vite + Redux Toolkit frontend, PostgreSQL database.

## 🚀 Features

### 👤 Member Management
- Add, update, delete members
- Paginated list with debounced search
- Form validation (10-digit phone, email)
- Per-member subscription status (Active / Expired / Upcoming / No Subscription)

### 📅 Attendance
- Daily check-in / mark absent
- Duplicate-check-in protection (one record per member per day)
- Monthly grid report
- Toast notifications for actions

### 💳 Subscriptions & Plans
- Manage plans (Monthly / Quarterly / Yearly seeded by default)
- Assign plan to a member with start & end dates
- Renewal creates a **new subscription record** rather than overwriting the old one
- Renew/Assign disabled while a member's plan is still active

### 📊 Dashboard
- Total / Active / Expired member counts
- Recent attendance activity feed
- Latest members snapshot

### 🔐 Auth
- JWT login
- Protected API routes via auth middleware
- Default admin auto-created on first run (`admin@gym.com` / `admin123`)

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Redux Toolkit + RTK Query (split per feature via `injectEndpoints`), Tailwind v4, react-hook-form + Zod, lucide-react, toastify-js
- **Backend**: Node.js (ESM), Express 5, Sequelize, Joi, JWT, bcryptjs
- **Database**: PostgreSQL
- **Deploy**: Vercel (frontend + serverless backend), Railway (Postgres)

## 📁 Project Structure

```text
backend/
└── src/
    ├── config/         # env, db, initDb (idempotent seed + sync)
    ├── controllers/    # auth, member, attendance, subscription, plan, dashboard
    ├── middlewares/    # auth, error
    ├── models/         # Sequelize models + associations
    ├── routes/         # Express routers, mounted under /api
    ├── utils/          # validate, memberStatusCTE, date, jwt, pagination, etc.
    └── server.js       # app entry; lazy DB-init middleware

frontend/
└── src/
    ├── components/     # Modal, ConfirmModal, PlanModal, Table, Pagination, PageLoader, PageError
    ├── hooks/          # useDebouncedValue
    ├── layout/         # Layout, Header, Sidebar, Footer
    ├── pages/
    │   ├── login/
    │   ├── dashboard/
    │   ├── members/
    │   ├── attendance/
    │   ├── plans/
    │   └── subscriptions/
    ├── redux/
    │   ├── apiSlice.js         # base RTK Query slice (no endpoints)
    │   ├── store.js
    │   ├── slices/authSlice.js
    │   └── api/                # injectEndpoints per feature
    │       ├── authApi.js
    │       ├── memberApi.js
    │       ├── planApi.js
    │       ├── dashboardApi.js
    │       ├── attendanceApi.js
    │       └── subscriptionApi.js
    └── utils/          # helpers (cn, formatDate), toast wrapper
```

## ⚙️ Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit values
npm run dev
```

Required env (see `backend/.env.example`):

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gym_management

JWT_SECRET=change-me
JWT_EXPIRES_IN=1d

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gym.com
ADMIN_PASSWORD=admin123
```

On first dev run the database is auto-synced and seeded (default admin, 3 plans, 20 members).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Production Deployment (Vercel + Railway)

### Database (Railway)
1. Create a PostgreSQL service.
2. Copy the connection details (host, port, user, password, db name). Prefer the **pooler** endpoint over the direct one for serverless workloads.

### Backend (Vercel)
1. Set env vars in the Vercel project (Settings → Environment Variables):
   - `NODE_ENV=production` *(required — enables SSL to Railway)*
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.
2. **First deploy only**: also set `DB_FORCE_INIT=true` so the function syncs the schema and seeds the admin/plans on first cold start. Remove (or set to `false`) afterwards — keeping it on adds seconds to every cold start.
3. Re-set `DB_FORCE_INIT=true` whenever you change a model and want the live DB to re-sync, then unset it.

### Frontend (Vercel)
- `VITE_API_URL=https://<your-backend>.vercel.app/api`
- [`frontend/vercel.json`](frontend/vercel.json) rewrites all routes to `index.html` so client-side routing works on hard reload.

### Keep-warm (recommended)
Vercel idles serverless functions after ~5–15 minutes, causing cold-start delays. The backend exposes a cheap, no-DB endpoint:

```
GET /health
```

Point a free uptime monitor (UptimeRobot, cron-job.org) at it on a 5-minute interval to keep the function warm. Real user requests stay fast.

## 🔧 Performance Notes

- **DB init is gated behind `NODE_ENV !== "production"` (or `DB_FORCE_INIT=true`)**. In production the cold-start path is just `connectDatabase()` — no sync, no seed checks. See [`backend/src/config/initDb.js`](backend/src/config/initDb.js).
- **Sequelize pool tuned for serverless**: `max: 2, idle: 1000ms, evict: 1000ms` in production. See [`backend/src/config/db.js`](backend/src/config/db.js).
- **CORS preflight cached for 24h** via `maxAge: 86400` so the browser doesn't OPTIONS-roundtrip before every API call.
- **Search inputs are debounced** (500ms) using a shared `useDebouncedValue` hook.

## 📜 API Surface (under `/api`)

| Method | Path | Auth |
|---|---|---|
| POST | `/auth/login` | public |
| GET / POST / PUT / DELETE | `/members[/:id]` | auth |
| POST | `/attendance/check-in` | auth |
| POST | `/attendance/mark-absent` | auth |
| GET | `/attendance/report?month&year` | auth |
| GET | `/plans` | auth |
| POST | `/subscriptions/assign` | auth |
| GET | `/subscriptions/member/:memberId/status` | auth |
| GET | `/subscriptions/members?status=active|expired` | auth |
| GET | `/dashboard/stats` | admin |

---
Built with ❤️ by the Argon team.
