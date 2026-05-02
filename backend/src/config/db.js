import { Sequelize } from "sequelize";
import pg from "pg";
import { env } from "./env.js";

const isProduction = env.nodeEnv === "production";

export const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
  host: env.dbHost,
  port: env.dbPort,
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  // Serverless: each cold-started function only handles one request at a time,
  // so a small pool with fast idle-eviction avoids leaking connections.
  pool: isProduction
    ? { max: 2, min: 0, acquire: 10000, idle: 1000, evict: 1000 }
    : { max: 5, min: 0, acquire: 30000, idle: 10000 },
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    throw error;
  }
};
