import { Router } from "express";
import {
  createPressConference,
  deletePressConference,
  getPressConference,
  getPressConferences,
  updatePressConference,
} from "../controllers/pressConference.controller";
import authMiddleware, { optionalAuthMiddleware } from "../middleware/auth.middleware";
import { pressConferenceUpload } from "../middleware/upload.middleware";

const router = Router();
const uploadFields = pressConferenceUpload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "pdfFile", maxCount: 1 },
]);

router.get("/", optionalAuthMiddleware, getPressConferences);
router.get("/:id", optionalAuthMiddleware, getPressConference);
router.post("/", authMiddleware, uploadFields, createPressConference);
router.put("/:id", authMiddleware, uploadFields, updatePressConference);
router.delete("/:id", authMiddleware, deletePressConference);

export default router;
