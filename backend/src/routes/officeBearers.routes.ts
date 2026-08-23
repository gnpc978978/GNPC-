import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import galleryUpload, { memberImportUpload } from "../middleware/galleryUpload";
import { createOfficeBearer, deleteOfficeBearer, exportOfficeBearers, getOfficeBearer, getOfficeBearers, getPublicOfficeBearers, importOfficeBearers, updateOfficeBearer } from "../controllers/officeBearersController";

const router = Router();
router.get("/public", getPublicOfficeBearers);
router.get("/export", authMiddleware, exportOfficeBearers);
router.post("/import", authMiddleware, memberImportUpload.single("file"), importOfficeBearers);
router.get("/", authMiddleware, getOfficeBearers);
router.get("/:id", getOfficeBearer);
router.post("/", authMiddleware, galleryUpload.single("photo"), createOfficeBearer);
router.put("/:id", authMiddleware, galleryUpload.single("photo"), updateOfficeBearer);
router.delete("/:id", authMiddleware, deleteOfficeBearer);
export default router;
