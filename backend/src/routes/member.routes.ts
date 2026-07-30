import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import galleryUpload, { memberImportUpload } from "../middleware/galleryUpload";
import { createMember, deleteMember, exportMembers, getMember, getMembers, getPublicMembers, importMembers, updateMember } from "../controllers/member.controller";

const router = Router();
router.get("/public", getPublicMembers);
router.get("/export", authMiddleware, exportMembers);
router.post("/import", authMiddleware, memberImportUpload.single("file"), importMembers);
router.get("/", authMiddleware, getMembers);
router.get("/:id", getMember);
router.post("/", authMiddleware, galleryUpload.single("photo"), createMember);
router.put("/:id", authMiddleware, galleryUpload.single("photo"), updateMember);
router.delete("/:id", authMiddleware, deleteMember);
export default router;
