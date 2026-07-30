import { Router } from "express";
import {
  createExecutiveCommittee, deleteExecutiveCommittee, exportExecutiveCommittee, getExecutiveCommittee,
  getExecutiveCommitteeMember, getExecutiveCommitteeStats, importExecutiveCommittee, updateExecutiveCommittee,
} from "../controllers/executiveCommitteeController";
import authMiddleware from "../middleware/auth.middleware";
import galleryUpload, { executiveImportUpload } from "../middleware/galleryUpload";

const router = Router();

router.get("/", getExecutiveCommittee);
router.get("/stats", authMiddleware, getExecutiveCommitteeStats);
router.get("/export", authMiddleware, exportExecutiveCommittee);
router.get("/:id", authMiddleware, getExecutiveCommitteeMember);
router.post("/", authMiddleware, galleryUpload.single("photo"), createExecutiveCommittee);
router.put("/:id", authMiddleware, galleryUpload.single("photo"), updateExecutiveCommittee);
router.delete("/:id", authMiddleware, deleteExecutiveCommittee);
router.post("/import", authMiddleware, executiveImportUpload.single("file"), importExecutiveCommittee);

export default router;
