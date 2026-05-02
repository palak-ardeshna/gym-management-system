import { Router } from "express";
import authRoutes from "./authRoutes.js";
import memberRoutes from "./memberRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import subscriptionRoutes from "./subscriptionRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import planRoutes from "./planRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mini Gym Management API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/plans", planRoutes);

export default router;
