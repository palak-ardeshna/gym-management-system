import { Router } from "express";
import { getAllPlans } from "../controller/planController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllPlans);

export default router;
