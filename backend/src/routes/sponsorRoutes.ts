import express from "express";

import {
  getSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from "../controllers/sponsorController";

import {
  sponsorUpload,
} from "../middleware/upload.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();


// GET ALL SPONSORS
router.get(
  "/",
  getSponsors
);


// GET SINGLE SPONSOR
router.get(
  "/:id",
  getSponsorById
);


// CREATE SPONSOR
router.post(
  "/",
  authMiddleware,
  sponsorUpload.single("logo"),
  createSponsor
);


// UPDATE SPONSOR
router.put(
  "/:id",
  authMiddleware,
  sponsorUpload.single("logo"),
  updateSponsor
);


// DELETE SPONSOR
router.delete(
  "/:id",
  authMiddleware,
  deleteSponsor
);

export default router;
