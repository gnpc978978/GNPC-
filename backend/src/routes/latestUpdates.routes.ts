import express from "express";
import { getLatestUpdates } from "../controllers/latestUpdates.controller";

const router = express.Router();
router.get("/", getLatestUpdates);

export default router;
