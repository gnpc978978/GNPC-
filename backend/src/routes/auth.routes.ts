import express, { NextFunction, Request, RequestHandler, Response } from "express";
import rateLimit from "express-rate-limit";

import {
login,
logout,
me,
requestPasswordReset,
verifyPasswordResetOtp,
resetPassword
}
from "../controllers/auth.controller";


import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();

// Express 4 does not forward rejected async handlers to its error middleware.
// This guarantees every auth request completes with an error response.
const asyncHandler = (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many reset attempts. Please try again later." },
});



router.post(
"/login",
asyncHandler(login)
);



router.get(
"/me",
authMiddleware,
asyncHandler(me)
);



router.post(
"/logout",
asyncHandler(logout)
);

router.post("/forgot-password", passwordResetLimiter, asyncHandler(requestPasswordReset));
router.post("/verify-reset-otp", passwordResetLimiter, asyncHandler(verifyPasswordResetOtp));
router.post("/reset-password", passwordResetLimiter, asyncHandler(resetPassword));



export default router;
