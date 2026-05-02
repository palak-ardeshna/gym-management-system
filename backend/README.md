# Mini Gym Management Backend

## Setup

1. Copy `.env.example` to `.env`
2. Create PostgreSQL database named `gym_management`
3. Update database credentials in `.env`
4. Run `npm install`
5. Run `npm run dev`

## Default Admin

- Email: `admin@gym.com`
- Password: `admin123`

## API Endpoints

- `POST /api/auth/login`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`
- `GET /api/members?page=1&limit=10&search=john`
- `POST /api/attendance/check-in`
- `POST /api/subscriptions/assign`
- `GET /api/subscriptions/member/:memberId/status`
- `GET /api/subscriptions/members?status=active`
- `GET /api/dashboard/stats`
