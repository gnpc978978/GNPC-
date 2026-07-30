import express from "express";

import {
  createPressRelease,
  getPressReleases,
  getSinglePressRelease,
  updatePressRelease,
  deletePressRelease,
} from "../controllers/pressRelease.controller";

import authMiddleware from "../middleware/auth.middleware";
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
  getPressReleases
);

router.get(
  "/:id",
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
