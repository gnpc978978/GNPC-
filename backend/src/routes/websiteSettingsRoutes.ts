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

const router = express.Router();

/*
 * =========================================================
 * ABOUT SETTINGS
 * =========================================================
 */

/*
 * Public About content.
 *
 * GET /api/settings/about
 */
router.get(
  "/about",
  getAboutSettings
);

/*
 * Admin About content update.
 *
 * PUT /api/settings/about
 *
 * JSON only.
 * Files are handled by /about/upload.
 */
router.put(
  "/about",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  updateAboutSettings
);

/*
 * Admin About media upload.
 *
 * POST /api/settings/about/upload
 *
 * multipart/form-data
 */
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

/*
 * Get website settings.
 */
router.get(
  "/",
  getSettings
);

/*
 * Membership form.
 */
router.get(
  "/membership-form",
  downloadMembershipForm
);

/*
 * Update website settings.
 */
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
 * Upload website setting files.
 */
router.put(
  "/upload",
  authMiddleware,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
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
