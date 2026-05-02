import { Router } from "express";
import { addMember, editMember, listMembers, removeMember, getMember } from "../controllers/memberController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", addMember);
router.get("/:id", getMember);
router.put("/:id", editMember);
router.delete("/:id", removeMember);
router.get("/", listMembers);

export default router;
