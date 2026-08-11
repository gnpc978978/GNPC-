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

router.get(
  "/public-stats",
  getPublicStats
);

/*
 * Public website traffic heartbeat.
 * This MUST NOT use authMiddleware because
 * normal website visitors are not logged in.
 */
router.post(
  "/traffic",
  trackTraffic
);

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

router.get(
  "/traffic",
  authMiddleware,
  getTrafficAnalytics
);

export default router;
