import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/stats", adminMiddleware, getDashboardStats);

export default router;
