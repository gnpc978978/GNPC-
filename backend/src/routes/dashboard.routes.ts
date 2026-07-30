import express from "express";

import {
  getDashboardStats,
  getDashboardCharts,
  getPublicStats
} from "../controllers/dashboard.controller";

import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();

router.get("/public-stats", getPublicStats);


router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);


router.get(
  "/charts",
  authMiddleware,
  getDashboardCharts
);


export default router;
