import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";

import authMiddleware from "../middleware/auth.middleware";
import { announcementUpload } from "../middleware/upload.middleware";

const router = express.Router();

router.get(
  "/",
  getAnnouncements
);

router.get(
  "/:id",
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
