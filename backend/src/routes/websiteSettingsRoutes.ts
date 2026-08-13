import {
  getAboutSettings,
  updateAboutSettings,
  uploadAboutSettingsFiles,
} from "../controllers/aboutSettings.controller";

import {
  aboutSettingsUpload,
} from "../middleware/upload.middleware";

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
      name: "presidentPhoto",
      maxCount: 1,
    },
  ]),
  uploadAboutSettingsFiles
);
