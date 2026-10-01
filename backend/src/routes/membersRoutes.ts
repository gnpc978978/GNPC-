import { Router } from "express";

import {
  getMembers,
  getPublicMembers,
  getMembersStats,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  importMembers,
  exportMembers,
} from "../controllers/membersController";

import authMiddleware from "../middleware/auth.middleware";

import galleryUpload, {
  membersImportUpload,
} from "../middleware/galleryUpload";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
|
| IMPORTANT:
| /public MUST come before /:id
|
| No authentication is used here.
|--------------------------------------------------------------------------
*/

router.get(
  "/public",
  getPublicMembers
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getMembers
);

router.get(
  "/stats",
  authMiddleware,
  getMembersStats
);

router.get(
  "/export",
  authMiddleware,
  exportMembers
);

router.get(
  "/:id",
  authMiddleware,
  getMember
);

router.post(
  "/",
  authMiddleware,
  galleryUpload.single(
    "photo"
  ),
  createMember
);

router.put(
  "/:id",
  authMiddleware,
  galleryUpload.single(
    "photo"
  ),
  updateMember
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMember
);

router.post(
  "/import",
  authMiddleware,
  membersImportUpload.single(
    "file"
  ),
  importMembers
);

export default router;
