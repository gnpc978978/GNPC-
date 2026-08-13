import { Request, Response } from "express";
import mongoose from "mongoose";

const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  const sessions = db.collection<any>("traffic_sessions");
  const stats = db.collection<any>("traffic_stats");

  return {
    sessions,
    stats,
  };
};

/**
 * Public dashboard statistics.
 *
 * Safe, aggregate information intended for the
 * public website.
 */
export const getPublicStats = async (
  req: Request,
  res: Response
) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB connection is not ready");
    }

    const [
      members,
      events,
      notices,
    ] = await Promise.all([
      db.collection("members").countDocuments(),
      db.collection("events").countDocuments(),
      db.collection("notices").countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        members,
        events,
        notices,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch public statistics:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch public statistics.",
    });
  }
};

/**
 * Track public website traffic.
 *
 * This endpoint intentionally does not require
 * authentication.
 */
export const trackTraffic = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const now = new Date();

    const ip =
      req.headers["x-forwarded-for"]
        ?.toString()
        .split(",")[0]
        .trim() ||
      req.socket.remoteAddress ||
      "";

    const userAgent =
      req.headers["user-agent"] || "";

    const path =
      typeof req.body?.path === "string"
        ? req.body.path
        : "/";

    await sessions.insertOne({
      path,
      userAgent,
      ip,
      createdAt: now,
    });

    const day = now.toISOString().slice(0, 10);

    await stats.updateOne(
      {
        date: day,
      },
      {
        $inc: {
          visits: 1,
        },
        $set: {
          updatedAt: now,
        },
      },
      {
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to track traffic:",
      error
    );

    /*
     * Traffic tracking should never break the
     * public website experience.
     */
    return res.status(200).json({
      success: false,
    });
  }
};

/**
 * Dashboard overview statistics.
 *
 * Protected by authMiddleware in dashboard.routes.ts.
 */
export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB connection is not ready");
    }

    const [
      members,
      events,
      notices,
    ] = await Promise.all([
      db.collection("members").countDocuments(),
      db.collection("events").countDocuments(),
      db.collection("notices").countDocuments(),
    ]);

    const { sessions } =
      getTrafficCollections();

    const totalVisitors =
      await sessions.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        members,
        events,
        notices,
        visitors: totalVisitors,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch dashboard statistics:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch dashboard statistics.",
    });
  }
};

/**
 * Dashboard chart data.
 *
 * Returns the most recent 30 days of traffic.
 */
export const getDashboardCharts = async (
  req: Request,
  res: Response
) => {
  try {
    const { stats } =
      getTrafficCollections();

    const chartData = await stats
      .find({})
      .sort({
        date: -1,
      })
      .limit(30)
      .toArray();

    chartData.reverse();

    return res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error(
      "Failed to fetch dashboard charts:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch dashboard chart data.",
    });
  }
};

/**
 * Detailed traffic analytics.
 *
 * Returns recent traffic sessions and
 * aggregated daily statistics.
 */
export const getTrafficAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const [dailyStats, recentSessions] =
      await Promise.all([
        stats
          .find({})
          .sort({
            date: -1,
          })
          .limit(30)
          .toArray(),

        sessions
          .find({})
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .toArray(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        dailyStats,
        recentSessions,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch traffic analytics:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch traffic analytics.",
    });
  }
};
