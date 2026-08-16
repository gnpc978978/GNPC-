import express from "express";

import {
  getSettings,
  updateSettings,
  downloadMembershipForm,
} from "../controllers/websiteSettingsController";

import {
  getAboutSettings,
  updateAboutSettings,
  uploadAboutSettingsFiles,
} from "../controllers/aboutSettings.controller";

import {
  uploadSettingsFiles,
} from "../controllers/websiteSettingsUploadController";

import {
  websiteSettingsUpload,
  aboutSettingsUpload,
} from "../middleware/upload.middleware";

import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";

const router =
  express.Router();

/*
 * =========================================================
 * ABOUT SETTINGS
 * =========================================================
 */

router.get(
  "/about",
  getAboutSettings
);

router.put(
  "/about",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  updateAboutSettings
);

router.post(
  "/about/upload",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  aboutSettingsUpload.fields([
    {
      name: "image",
      maxCount: 1,
    },

    {
      name: "aboutMedia",
      maxCount: 2,
    },

    {
      name: "presidentPhoto",
      maxCount: 1,
    },
  ]),
  uploadAboutSettingsFiles
);

/*
 * =========================================================
 * WEBSITE SETTINGS
 * =========================================================
 */

router.get(
  "/",
  getSettings
);

router.get(
  "/membership-form",
  downloadMembershipForm
);

router.put(
  "/",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  updateSettings
);

/*
 * =========================================================
 * WEBSITE SETTINGS FILES
 * =========================================================
 *
 * IMPORTANT:
 *
 * We use .any() here because the Home CMS has dynamic
 * field names:
 *
 * homeMedia_about_0
 * homeMedia_about_1
 * homeMedia_objectives_0
 * homeMedia_gallery_0
 * etc.
 *
 * The controller contains the whitelist/regex validation.
 */

router.put(
  "/upload",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  websiteSettingsUpload.any(),
  uploadSettingsFiles
);

export default router;
