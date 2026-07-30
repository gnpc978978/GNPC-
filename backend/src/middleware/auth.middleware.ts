import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (
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


    req.user = decoded;

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
