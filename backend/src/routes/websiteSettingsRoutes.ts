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
 * ABOUT
 * =========================================================
 */

/*
 * GET /api/settings/about
 */
router.get(
  "/about",
  getAboutSettings
);

/*
 * PUT /api/settings/about
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
 * POST /api/settings/about/upload
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
 * GENERAL WEBSITE SETTINGS
 * =========================================================
 */

/*
 * GET /api/settings
 */
router.get(
  "/",
  getSettings
);

/*
 * GET /api/settings/membership-form
 */
router.get(
  "/membership-form",
  downloadMembershipForm
);

/*
 * PUT /api/settings
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
 * PUT /api/settings/upload
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
