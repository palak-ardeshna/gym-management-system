import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { initializeDatabase } from "./config/initDb.js";
import apiRoutes from "./route/index.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

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

app.use(async (req, res, next) => {
  try {
    await ensureInitialized();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
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
