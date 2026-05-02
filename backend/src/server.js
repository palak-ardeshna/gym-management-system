import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { initializeDatabase } from "./config/initDb.js";
import apiRoutes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

// maxAge tells browsers to cache the OPTIONS preflight result for 24h,
// so subsequent same-origin API calls skip the extra round trip.
app.use(cors({ origin: true, maxAge: 86400 }));
app.use(express.json());

// Cheap endpoints that don't need DB — safe targets for uptime/warmup pings.
app.get("/", (req, res) => res.send("Server is running"));
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

let initPromise = null;
const ensureInitialized = () => {
  if (!initPromise) {
    initPromise = initializeDatabase().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
};

// DB init is gated to /api so /health stays instant even on cold start.
app.use("/api", async (req, res, next) => {
  try {
    await ensureInitialized();
    next();
  } catch (err) {
    next(err);
  }
});
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

if (env.nodeEnv !== "production") {
  ensureInitialized()
    .then(() => {
      app.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}

export default app;
