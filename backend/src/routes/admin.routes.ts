import express from "express";
import {
  changeStatus,
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAdmins,
  updateAdmin,
  resetAdminPassword,
} from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";

const router = express.Router();
const superAdminOnly = [authMiddleware, requireRole("SUPER_ADMIN")];

router.get("/", ...superAdminOnly, getAdmins);
router.get("/:id", ...superAdminOnly, getAdminById);
router.post("/", ...superAdminOnly, createAdmin);
router.put("/:id", ...superAdminOnly, updateAdmin);
router.put("/:id/reset-password", ...superAdminOnly, resetAdminPassword);
router.delete("/:id", ...superAdminOnly, deleteAdmin);

router.patch("/:id/activate", ...superAdminOnly, (req, _res, next) => {
  req.body.status = "ACTIVE";
  next();
}, changeStatus);

router.patch("/:id/deactivate", ...superAdminOnly, (req, _res, next) => {
  req.body.status = "INACTIVE";
  next();
}, changeStatus);

export default router;
