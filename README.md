# 🏋️‍♂️ Gym Management System (Argon)

A comprehensive Gym Management System with a robust Backend (Node.js, Express, PostgreSQL) and a modern Frontend (React, Tailwind CSS, Redux Toolkit).

## 🚀 Key Features

### 👤 Member Management
- Add, update, and delete members.
- Paginated member list with search functionality.
- Form validation (10-digit phone, valid email).
- Automatic status tracking (Active/Expired/No Subscription).

### 📅 Attendance System
- Daily check-in/check-out for members.
- Prevent duplicate check-ins for the same day.
- Detailed monthly attendance reports with grid view.
- Real-time success messages with date-specific info.

### 💳 Subscription & Plans
- Create and manage gym plans.
- Assign plans to members with custom start and end dates.
- Automatic expiration tracking based on dates.

### 📊 Dashboard
- Real-time statistics (Total Members, Active, Expired).
- Live "Recent Activity" feed showing latest attendance logs.
- "Latest Members" list for quick access.

### 🔐 Security
- JWT-based Authentication.
- Protected API routes via Middleware.
- Secure password handling.

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit (RTK Query), Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js, Sequelize ORM.
- **Database**: PostgreSQL.
- **Validation**: Joi (Backend), React Hook Form + Zod (Frontend).

## 📁 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Env config
│   │   ├── controller/   # API Logic
│   │   ├── middleware/   # Auth & Error handlers
│   │   ├── model/        # Sequelize Models
│   │   ├── route/        # Express Routes
│   │   └── utils/        # Helpers & JWT
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Table, Modal, etc.)
│   │   ├── pages/        # Feature-based pages (Attendance, Members, etc.)
│   │   ├── redux/        # API Slices & Store
│   │   └── utils/        # Helpers & Constants
```

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to `backend/` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on your environment:
   ```env
   PORT=5000
   DB_NAME=gym_db
   DB_USER=postgres
   DB_PASS=your_password
   DB_HOST=localhost
   JWT_SECRET=your_secret_key
   ```
4. Run the server: `npm run dev`. (Database will auto-seed with 20 dummy members on first run).

### 2. Frontend Setup
1. Navigate to `frontend/` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start development server: `npm run dev`.

## 🚢 Deployment (Railway.app)

To deploy the database on Railway:
1. Create a new PostgreSQL instance on Railway.
2. Copy the `DATABASE_URL`.
3. Set the environment variables in your Railway Backend service.
4. Ensure `SSL` is enabled in Sequelize config for production.

---
Developed with ❤️ by Argon Team.
