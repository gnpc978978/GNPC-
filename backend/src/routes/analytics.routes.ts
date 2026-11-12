import express, { NextFunction, Request, RequestHandler, Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { createHash } from "crypto";
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
  limit: 180,
  standardHeaders: true,
  keyGenerator: (req) => {
    const visitorId = req.body?.visitorId;
    if (typeof visitorId === "string" && visitorId.length >= 16 && visitorId.length <= 80) {
      return createHash("sha256").update(visitorId).digest("hex");
    }
    return ipKeyGenerator(req.ip || "unknown");
  },
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
