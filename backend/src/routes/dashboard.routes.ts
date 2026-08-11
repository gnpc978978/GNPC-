import express from "express";

import {
  getDashboardStats,
  getDashboardCharts,
  getPublicStats,
  trackTraffic,
  getTrafficAnalytics,
} from "../controllers/dashboard.controller";

import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

// Public website statistics
router.get(
  "/public-stats",
  getPublicStats
);

// Public traffic heartbeat
router.post(
  "/traffic",
  trackTraffic
);

// Admin dashboard statistics
router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

// Admin dashboard charts
router.get(
  "/charts",
  authMiddleware,
  getDashboardCharts
);

// Admin traffic analytics
router.get(
  "/traffic",
  authMiddleware,
  getTrafficAnalytics
);

export default router;
