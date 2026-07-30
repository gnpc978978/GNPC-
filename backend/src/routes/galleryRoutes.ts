import express from "express";

import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController";

import galleryUpload from "../middleware/galleryUpload";
import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();


// GET ALL GALLERY
router.get(
  "/",
  getGallery
);


// CREATE GALLERY
router.post(
  "/",
  authMiddleware,
  galleryUpload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  createGallery
);


// UPDATE GALLERY
router.put(
  "/:id",
  authMiddleware,
  galleryUpload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  updateGallery
);


// DELETE GALLERY
router.delete(
  "/:id",
  authMiddleware,
  deleteGallery
);


export default router;
