import { Router } from "express";
import {
  createMember, deleteMember, exportMembers, getMembers,
  getMember, getMembersStats, importMembers, updateMember,
} from "../controllers/membersController";
import authMiddleware from "../middleware/auth.middleware";
import galleryUpload, { membersImportUpload } from "../middleware/galleryUpload";

const router = Router();

router.get("/", getMembers);
router.get("/stats", authMiddleware, getMembersStats);
router.get("/export", authMiddleware, exportMembers);
router.get("/:id", authMiddleware, getMember);
router.post("/", authMiddleware, galleryUpload.single("photo"), createMember);
router.put("/:id", authMiddleware, galleryUpload.single("photo"), updateMember);
router.delete("/:id", authMiddleware, deleteMember);
router.post("/import", authMiddleware, membersImportUpload.single("file"), importMembers);

export default router;
