import express from "express";

import {
  createPressRelease,
  getPressReleases,
  getSinglePressRelease,
  updatePressRelease,
  deletePressRelease,
} from "../controllers/pressRelease.controller";

import authMiddleware, { optionalAuthMiddleware } from "../middleware/auth.middleware";
import { pressReleaseUpload } from "../middleware/upload.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  pressReleaseUpload.single("image"),
  createPressRelease
);

router.get(
  "/",
  optionalAuthMiddleware,
  getPressReleases
);

router.get(
  "/:id",
  optionalAuthMiddleware,
  getSinglePressRelease
);

router.put(
  "/:id",
  authMiddleware,
  pressReleaseUpload.single("image"),
  updatePressRelease
);

router.delete(
  "/:id",
  authMiddleware,
  deletePressRelease
);

export default router;
