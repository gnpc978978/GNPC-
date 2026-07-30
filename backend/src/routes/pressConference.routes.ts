import { Router } from "express";
import {
  createPressConference,
  deletePressConference,
  getPressConference,
  getPressConferences,
  updatePressConference,
} from "../controllers/pressConference.controller";
import authMiddleware from "../middleware/auth.middleware";
import { pressConferenceUpload } from "../middleware/upload.middleware";

const router = Router();
const uploadFields = pressConferenceUpload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "pdfFile", maxCount: 1 },
]);

router.get("/", getPressConferences);
router.get("/:id", getPressConference);
router.post("/", authMiddleware, uploadFields, createPressConference);
router.put("/:id", authMiddleware, uploadFields, updatePressConference);
router.delete("/:id", authMiddleware, deletePressConference);

export default router;
