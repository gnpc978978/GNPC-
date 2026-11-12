import express, { NextFunction, Request, RequestHandler, Response } from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import {
  analyticsEvent,
  analyticsHeartbeat,
  getAnalyticsReport,
} from "../controllers/analytics.controller";

const router = express.Router();

const asyncHandler = (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

const intakeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Analytics event rate limit reached." },
});

const dashboardAccess = [
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
];

router.post("/heartbeat", intakeLimiter, asyncHandler(analyticsHeartbeat));
router.post("/event", intakeLimiter, asyncHandler(analyticsEvent));
router.get("/report", ...dashboardAccess, asyncHandler(getAnalyticsReport));

export default router;
