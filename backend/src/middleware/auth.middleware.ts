import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {

    let token;

    // An explicitly supplied bearer token represents the active browser session.
    // Prefer it over a stale cookie left by a previous administrator login.
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Cookie token fallback for normal browser navigation.
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }


    if (!token) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[auth] /me rejected: no bearer token or auth cookie");
      }
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );


    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Tokens are short-lived credentials, not a replacement for the current
    // account state. This prevents an inactive/deleted administrator from
    // continuing to mutate CMS data until an old JWT expires.
    const user = await User.findById(decoded.id).select("role status").lean();
    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = { id: user._id.toString(), role: user.role };

    if (process.env.NODE_ENV !== "production") {
      console.debug("[auth] token verified", { userId: decoded.id });
    }

    return next();


  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.debug("[auth] token verification failed", error);
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }
};

export default authMiddleware;

// Public feeds use this to show draft content only to an authenticated CMS
// user, while keeping the same public URL for existing consumers.
export const optionalAuthMiddleware = async (
  req: any,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : req.cookies?.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id?: string };
    if (!decoded.id) return next();
    const user = await User.findById(decoded.id).select("role status").lean();
    if (user?.status === "ACTIVE") req.user = { id: user._id.toString(), role: user.role };
  } catch {
    // An invalid optional credential must not expose unpublished records.
  }
  return next();
};
