import { Request, Response } from "express";
import mongoose from "mongoose";

const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }
import { Request, Response } from "express";
import mongoose from "mongoose";

import User from "../models/User";
import PressRelease from "../models/pressRelease.model";
import Event from "../models/event.model";
import Gallery from "../models/Gallery";
import PressConference from "../models/PressConference";

const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  const sessions = db.collection("traffic_sessions");
  const stats = db.collection("traffic_stats");

  return {
    sessions,
    stats,
  };
};

/**
 * PUBLIC STATS
 */
export const getPublicStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      pressReleases,
      events,
      gallery,
    ] = await Promise.all([
      PressRelease.countDocuments({
        status: "PUBLISHED",
        isActive: true,
      }),

      Event.countDocuments({
        status: "published",
        isActive: true,
      }),

      Gallery.countDocuments({
        status: "active",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        pressReleases,
        events,
        gallery,
      },
    });
  } catch (error) {
    console.error(
      "getPublicStats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch public statistics.",
    });
  }
};

/**
 * PUBLIC TRAFFIC TRACKING
 *
 * No authentication required.
 */
export const trackTraffic = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      sessions,
      stats,
    } = getTrafficCollections();

    const now = new Date();

    const path =
      typeof req.body?.path === "string"
        ? req.body.path.trim()
        : "/";

    const userAgent =
      typeof req.headers["user-agent"] ===
      "string"
        ? req.headers["user-agent"]
        : "";

    await sessions.insertOne({
      path: path || "/",
      userAgent,
      createdAt: now,
    });

    const date =
      now.toISOString().slice(0, 10);

    await stats.updateOne(
      { date },
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
      "trackTraffic error:",
      error
    );

    /*
     * Analytics must never break the
     * public website.
     */
    return res.status(200).json({
      success: false,
    });
  }
};

/**
 * DASHBOARD STATS
 *
 * IMPORTANT:
 * The frontend expects:
 *
 * {
 *   success: true,
 *   stats: {
 *     admins,
 *     pressReleases,
 *     events,
 *     gallery
 *   }
 * }
 */
export const getDashboardStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      admins,
      pressReleases,
      events,
      gallery,
    ] = await Promise.all([
      User.countDocuments({
        role: {
          $in: [
            "ADMIN",
            "SUPER_ADMIN",
          ],
        },
      }),

      PressRelease.countDocuments({
        status: "PUBLISHED",
        isActive: true,
      }),

      Event.countDocuments({
        status: "published",
        isActive: true,
      }),

      Gallery.countDocuments({
        status: "active",
      }),
    ]);

    const stats = {
      admins,
      pressReleases,
      events,
      gallery,
    };

    return res.status(200).json({
      success: true,

      /*
       * Frontend dashboard uses data.stats.
       */
      stats,

      /*
       * Keep data as well for compatibility
       * with any other frontend code.
       */
      data: stats,
    });
  } catch (error) {
    console.error(
      "getDashboardStats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics.",
      stats: {
        admins: 0,
        pressReleases: 0,
        events: 0,
        gallery: 0,
      },
    });
  }
};

/**
 * DASHBOARD CHARTS
 *
 * Returns the last 6 months.
 *
 * The frontend Charts component expects:
 *
 * month
 * pressReleases
 * events
 * gallery
 * pressConferences
 */
export const getDashboardCharts = async (
  _req: Request,
  res: Response
) => {
  try {
    const now = new Date();

    const months: {
      month: string;
      start: Date;
      end: Date;
    }[] = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      months.push({
        month: start.toLocaleString(
          "en-IN",
          {
            month: "short",
          }
        ),
        start,
        end,
      });
    }

    const data = await Promise.all(
      months.map(async (item) => {
        const [
          pressReleases,
          events,
          gallery,
          pressConferences,
        ] = await Promise.all([
          PressRelease.countDocuments({
            createdAt: {
              $gte: item.start,
              $lt: item.end,
            },
          }),

          Event.countDocuments({
            createdAt: {
              $gte: item.start,
              $lt: item.end,
            },
          }),

          Gallery.countDocuments({
            createdAt: {
              $gte: item.start,
              $lt: item.end,
            },
          }),

          PressConference.countDocuments({
            createdAt: {
              $gte: item.start,
              $lt: item.end,
            },
          }),
        ]);

        return {
          month: item.month,
          pressReleases,
          pressConferences,
          events,
          gallery,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "getDashboardCharts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard chart data.",
      data: [],
    });
  }
};

/**
 * TRAFFIC ANALYTICS
 *
 * Protected endpoint.
 */
export const getTrafficAnalytics = async (
  _req: Request,
  res: Response
) => {
  try {
    const {
      sessions,
      stats,
    } = getTrafficCollections();

    const [
      dailyStats,
      recentSessions,
    ] = await Promise.all([
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
        dailyStats: dailyStats.reverse(),
        recentSessions,
      },
    });
  } catch (error) {
    console.error(
      "getTrafficAnalytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch traffic analytics.",
      data: {
        dailyStats: [],
        recentSessions: [],
      },
    });
  }
};
  const sessions = db.collection("traffic_sessions");
  const stats = db.collection("traffic_stats");

  return {
    sessions,
    stats,
  };
};

/**
 * Public statistics.
 *
 * Keep this endpoint intentionally lightweight.
 * The public website must continue working even if
 * traffic collections are unavailable.
 */
export const getPublicStats = async (
  req: Request,
  res: Response
) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database connection is not ready.",
      });
    }

    const { stats } = getTrafficCollections();

    const latest = await stats
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    const latestStats = latest[0] || {};

    return res.status(200).json({
      success: true,
      data: {
        visitors: latestStats.visitors ?? 0,
        visits: latestStats.visits ?? 0,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch public statistics:",
      error
    );

    return res.status(200).json({
      success: true,
      data: {
        visitors: 0,
        visits: 0,
      },
    });
  }
};

/**
 * Public traffic heartbeat.
 *
 * This route is intentionally unauthenticated.
 */
export const trackTraffic = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const now = new Date();

    const path =
      typeof req.body?.path === "string"
        ? req.body.path
        : "/";

    const userAgent =
      typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"]
        : "";

    await sessions.insertOne({
      path,
      userAgent,
      createdAt: now,
    });

    const date = now.toISOString().slice(0, 10);

    await stats.updateOne(
      { date },
      {
        $inc: {
          visits: 1,
          visitors: 1,
        },
        $set: {
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Traffic tracking failed:",
      error
    );

    /*
     * Never make the public website fail because
     * analytics tracking failed.
     */
    return res.status(200).json({
      success: false,
    });
  }
};

/**
 * Protected dashboard statistics.
 */
export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const totalVisitors =
      await sessions.countDocuments();

    const latestStats = await stats
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    const latest = latestStats[0] || {};

    return res.status(200).json({
      success: true,
      data: {
        visitors: totalVisitors,
        visits: latest.visits ?? 0,
        today: latest,
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
 * Protected dashboard chart data.
 */
export const getDashboardCharts = async (
  req: Request,
  res: Response
) => {
  try {
    const { stats } =
      getTrafficCollections();

    const data = await stats
      .find({})
      .sort({ date: -1 })
      .limit(30)
      .toArray();

    data.reverse();

    return res.status(200).json({
      success: true,
      data,
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
 * Protected traffic analytics.
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
          .sort({ date: -1 })
          .limit(30)
          .toArray(),

        sessions
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        dailyStats: dailyStats.reverse(),
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
