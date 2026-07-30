import express from "express";
import {
  createBanners,
  deleteBanner,
  getBanners,
  reorderBanners,
  updateBanner,
} from "../controllers/banner.controller";
import authMiddleware from "../middleware/auth.middleware";
import { bannerUpload } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getBanners);
router.post("/", authMiddleware, bannerUpload.array("images", 10), createBanners);
router.put("/reorder", authMiddleware, reorderBanners);
router.put("/:id", authMiddleware, bannerUpload.single("image"), updateBanner);
router.delete("/:id", authMiddleware, deleteBanner);

export default router;
