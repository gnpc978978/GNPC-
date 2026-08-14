import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";

import authMiddleware, { optionalAuthMiddleware } from "../middleware/auth.middleware";
import { announcementUpload } from "../middleware/upload.middleware";

const router = express.Router();

router.get(
  "/",
  optionalAuthMiddleware,
  getAnnouncements
);

router.get(
  "/:id",
  optionalAuthMiddleware,
  getAnnouncement
);

router.post(
  "/",
  authMiddleware,
  announcementUpload.single("image"),
  createAnnouncement
);

router.put(
  "/:id",
  authMiddleware,
  announcementUpload.single("image"),
  updateAnnouncement
);

router.delete(
  "/:id",
  authMiddleware,
  deleteAnnouncement
);

export default router;
