import { Router } from "express";
import {
  assignPlan,
  getMemberStatus,
  listMembersByStatus,
} from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/assign", assignPlan);
router.get("/member/:memberId/status", getMemberStatus);
router.get("/members", listMembersByStatus);

export default router;
