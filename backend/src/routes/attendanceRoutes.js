import { Router } from "express";
import { checkInMember, getAttendanceReport, markAbsent } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/check-in", checkInMember);
router.post("/mark-absent", markAbsent);
router.get("/report", getAttendanceReport);

export default router;
