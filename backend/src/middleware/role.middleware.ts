import { NextFunction, Response } from "express";
import User from "../models/User";

const requireRole = (...roles: string[]) => {
  return async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user =
        await User.findById(
          req.user.id
        ).select("role status");

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Account no longer exists.",
        });
      }

      if (user.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          message:
            "Your account is inactive.",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      // Always use the CURRENT DB role.
      req.user.role = user.role;

      next();
    } catch (error) {
      console.error(
        "Role middleware error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to verify permissions.",
      });
    }
  };
};

export default requireRole;
