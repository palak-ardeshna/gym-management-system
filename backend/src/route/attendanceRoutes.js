import { Router } from "express";
import { checkInMember, getAttendanceReport, markAbsent } from "../controller/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/check-in", checkInMember);
router.post("/mark-absent", markAbsent);
router.get("/report", getAttendanceReport);

export default router;
