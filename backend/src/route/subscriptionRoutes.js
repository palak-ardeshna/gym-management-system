import { Router } from "express";
import {
  assignPlan,
  getMemberStatus,
  listMembersByStatus,
} from "../controller/subscriptionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/assign", assignPlan);
router.get("/member/:memberId/status", getMemberStatus);
router.get("/members", listMembersByStatus);

export default router;
