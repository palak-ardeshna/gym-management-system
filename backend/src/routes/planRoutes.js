import { Router } from "express";
import { getAllPlans } from "../controllers/planController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllPlans);

export default router;
