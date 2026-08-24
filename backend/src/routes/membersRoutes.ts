import { Router } from "express";
import {
  createMember,
  deleteMember,
  exportMembers,
  getMembers,
  getPublicMembers,
  getMember,
  getMembersStats,
  importMembers,
  updateMember,
} from "../controllers/membersController";
import authMiddleware from "../middleware/auth.middleware";
import galleryUpload, {
  membersImportUpload,
} from "../middleware/galleryUpload";

const router = Router();

/*
 * PUBLIC ROUTES
 * These routes are intentionally placed before "/:id".
 */

// Public members directory
router.get("/public", getPublicMembers);

/*
 * ADMIN ROUTES
 */

// Admin members listing
router.get("/", authMiddleware, getMembers);

// Admin statistics
router.get(
  "/stats",
  authMiddleware,
  getMembersStats
);

// Admin export
router.get(
  "/export",
  authMiddleware,
  exportMembers
);

// Admin single member
router.get(
  "/:id",
  authMiddleware,
  getMember
);

// Create member
router.post(
  "/",
  authMiddleware,
  galleryUpload.single("photo"),
  createMember
);

// Update member
router.put(
  "/:id",
  authMiddleware,
  galleryUpload.single("photo"),
  updateMember
);

// Delete member
router.delete(
  "/:id",
  authMiddleware,
  deleteMember
);

// Import members
router.post(
  "/import",
  authMiddleware,
  membersImportUpload.single("file"),
  importMembers
);

export default router;
