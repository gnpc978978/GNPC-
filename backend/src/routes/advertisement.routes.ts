import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { sponsorUpload } from "../middleware/upload.middleware";
import { createAdvertisement, deleteAdvertisement, getAdvertisement, getAdvertisements, updateAdvertisement } from "../controllers/advertisement.controller";

const router = Router();

router.get("/", getAdvertisements);
router.get("/:id", getAdvertisement);
router.post("/", authMiddleware, sponsorUpload.single("banner"), createAdvertisement);
router.put("/:id", authMiddleware, sponsorUpload.single("banner"), updateAdvertisement);
router.delete("/:id", authMiddleware, deleteAdvertisement);

export default router;
