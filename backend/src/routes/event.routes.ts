import express from "express";

import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";

import authMiddleware from "../middleware/auth.middleware";
import { eventUpload } from "../middleware/upload.middleware";


const router = express.Router();


router.get(
  "/",
  getEvents
);


router.get(
  "/:id",
  getEvent
);


router.post(
  "/",
  authMiddleware,
  eventUpload.fields([
    {
      name: "banner",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 10,
    },
  ]),
  createEvent
);


router.put(
  "/:id",
  authMiddleware,
  eventUpload.fields([
    {
      name: "banner",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 10,
    },
  ]),
  updateEvent
);


router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);


export default router;
