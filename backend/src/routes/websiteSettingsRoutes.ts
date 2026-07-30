import express from "express";

import {
  getSettings,
  updateSettings,
  downloadMembershipForm,
} from "../controllers/websiteSettingsController";
import { getAboutSettings, updateAboutSettings } from "../controllers/aboutSettings.controller";

import {
  uploadSettingsFiles,
} from "../controllers/websiteSettingsUploadController";

import {
  websiteSettingsUpload,
  aboutSettingsUpload,
} from "../middleware/upload.middleware";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";

const router = express.Router();

router.get("/about", getAboutSettings);
router.put("/about", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN"), aboutSettingsUpload.fields([{ name: "image", maxCount: 1 }, { name: "presidentPhoto", maxCount: 1 }]), updateAboutSettings);


// GET SETTINGS
router.get(
  "/",
  getSettings
);

router.get("/membership-form", downloadMembershipForm);


// UPDATE SETTINGS DATA
router.put(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  updateSettings
);


// UPLOAD SETTINGS FILES
router.put(
  "/upload",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  websiteSettingsUpload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "favicon",
      maxCount: 1,
    },
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "aboutImage",
      maxCount: 1,
    },
    {
      name: "membershipPdf",
      maxCount: 1,
    },
  ]),
  uploadSettingsFiles
);

export default router;
