import express from "express";

import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactMessageController";
import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();



// Public Contact Form
router.post(
  "/",
  createContactMessage
);



// Admin Get All Messages
router.get(
  "/",
  authMiddleware,
  getContactMessages
);



// Admin Get Single Message
router.get(
  "/:id",
  authMiddleware,
  getContactMessageById
);



// Update Message Status
router.put(
  "/:id/status",
  authMiddleware,
  updateContactMessageStatus
);



// Delete Message
router.delete(
  "/:id",
  authMiddleware,
  deleteContactMessage
);



export default router;
