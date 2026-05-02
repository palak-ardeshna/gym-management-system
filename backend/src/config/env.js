import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 5432),
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "postgres",
  dbName: process.env.DB_NAME || "gym_management",
  jwtSecret: process.env.JWT_SECRET || "gym_management_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  adminName: process.env.ADMIN_NAME || "Admin",
  adminEmail: process.env.ADMIN_EMAIL || "admin@gym.com",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};
