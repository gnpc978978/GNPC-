import { Router } from "express";
import { getPublicExecutiveCommittee, importExecutiveCommittee } from "../controllers/executiveCommitteeController";
import authMiddleware from "../middleware/auth.middleware";
import { executiveImportUpload } from "../middleware/galleryUpload";

const router = Router();

router.get("/", getPublicExecutiveCommittee);
router.post("/import", authMiddleware, executiveImportUpload.single("file"), importExecutiveCommittee);

export default router;
