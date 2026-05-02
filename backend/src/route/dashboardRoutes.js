import { Router } from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/stats", adminMiddleware, getDashboardStats);

export default router;
