import { Request, Response } from "express";
import mongoose from "mongoose";

import User from "../models/User";
import Event from "../models/Event";
import Gallery from "../models/Gallery";
import ExecutiveCommittee from "../models/ExecutiveCommittee";
import PressRelease from "../models/pressRelease.model";

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const admins = await User.countDocuments();

    const pressReleases = await PressRelease.countDocuments({
      isActive: { $ne: false },
      status: "PUBLISHED",
    });

    const events = await Event.countDocuments({
      isActive: { $ne: false },
    });

    const gallery = await Gallery.countDocuments();

    res.status(200).json({
      success: true,

      stats: {
        admins,
        pressReleases,
        events,
        gallery,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

// =====================================================
// DASHBOARD ANALYTICS / CHARTS
// =====================================================

export const getDashboardCharts = async (
  req: Request,
  res: Response
) => {
  try {
    const year =
      Number(req.query.year) ||
      new Date().getFullYear();

    const startOfYear = new Date(
      year,
      0,
      1,
      0,
      0,
      0,
      0
    );

    const startOfNextYear = new Date(
      year + 1,
      0,
      1,
      0,
      0,
      0,
      0
    );

    const [
      pressReleases,
      events,
      gallery,
    ] = await Promise.all([
      PressRelease.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfYear,
              $lt: startOfNextYear,
            },

            isActive: {
              $ne: false,
            },

            status: "PUBLISHED",
          },
        },

        {
          $group: {
            _id: {
              $month: "$createdAt",
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Event.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfYear,
              $lt: startOfNextYear,
            },

            isActive: {
              $ne: false,
            },
          },
        },

        {
          $group: {
            _id: {
              $month: "$createdAt",
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Gallery.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfYear,
              $lt: startOfNextYear,
            },
          },
        },

        {
          $group: {
            _id: {
              $month: "$createdAt",
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = months.map(
      (month, index) => {
        const monthNumber = index + 1;

        const pressReleaseData =
          pressReleases.find(
            (item) =>
              item._id === monthNumber
          );

        const eventData =
          events.find(
            (item) =>
              item._id === monthNumber
          );

        const galleryData =
          gallery.find(
            (item) =>
              item._id === monthNumber
          );

        return {
          month,

          pressReleases:
            pressReleaseData?.count || 0,

          events:
            eventData?.count || 0,

          gallery:
            galleryData?.count || 0,
        };
      }
    );

    res.status(200).json({
      success: true,
      year,
      data,
    });
  } catch (error) {
    console.error("Charts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard charts",
    });
  }
};

// =====================================================
// TRAFFIC TRACKING
// =====================================================

const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  return {
    sessions: db.collection("traffic_sessions"),
    stats: db.collection("traffic_stats"),
  };
};

// Public endpoint called by the website
export const trackTraffic = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const sessionId =
      typeof req.body?.sessionId === "string"
        ? req.body.sessionId.trim()
        : "";

    const page =
      typeof req.body?.page === "string"
        ? req.body.page.slice(0, 300)
        : "/";

    if (
      !sessionId ||
      sessionId.length < 10 ||
      sessionId.length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid session",
      });
    }

    const now = new Date();

    const existingSession =
      await sessions.findOne({
        sessionId,
      });

    if (existingSession) {
      await sessions.updateOne(
        {
          sessionId,
        },
        {
          $set: {
            lastSeen: now,
            page,
          },
        }
      );
    } else {
      await sessions.insertOne({
        sessionId,
        createdAt: now,
        lastSeen: now,
        page,
      });
    }

    // A visitor is considered online if active
    // within the last 2 minutes.
    const onlineSince = new Date(
      now.getTime() - 2 * 60 * 1000
    );

    const onlineNow =
      await sessions.countDocuments({
        lastSeen: {
          $gte: onlineSince,
        },
      });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayVisits =
      await sessions.countDocuments({
        createdAt: {
          $gte: startOfToday,
        },
      });

    let trafficStats =
      await stats.findOne({
        _id: "global",
      });

    if (!trafficStats) {
      await stats.insertOne({
        _id: "global",
        totalVisits: 1,
        peakOnline: onlineNow,
        peakAt: now,
        updatedAt: now,
      });

      trafficStats = await stats.findOne({
        _id: "global",
      });
    } else {
      const isNewSession =
        !existingSession;

      if (
        isNewSession ||
        onlineNow >
          Number(trafficStats.peakOnline || 0)
      ) {
        const update: Record<
          string,
          unknown
        > = {
          updatedAt: now,
        };

        if (isNewSession) {
          update.totalVisits =
            Number(
              trafficStats.totalVisits || 0
            ) + 1;
        }

        if (
          onlineNow >
          Number(trafficStats.peakOnline || 0)
        ) {
          update.peakOnline = onlineNow;
          update.peakAt = now;
        }

        await stats.updateOne(
          {
            _id: "global",
          },
          {
            $set: update,
          }
        );

        trafficStats =
          await stats.findOne({
            _id: "global",
          });
      } else {
        await stats.updateOne(
          {
            _id: "global",
          },
          {
            $set: {
              updatedAt: now,
            },
          }
        );
      }
    }

    return res.status(200).json({
      success: true,

      traffic: {
        onlineNow,
        todayVisits,
        totalVisits:
          Number(
            trafficStats?.totalVisits || 0
          ),
        peakOnline:
          Number(
            trafficStats?.peakOnline || onlineNow
          ),
        peakAt:
          trafficStats?.peakAt || now,
      },
    });
  } catch (error) {
    console.error(
      "Traffic Tracking Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to track traffic",
    });
  }
};

// Admin traffic overview
export const getTrafficAnalytics = async (
  _req: Request,
  res: Response
) => {
  try {
    const { sessions, stats } =
      getTrafficCollections();

    const now = new Date();

    const onlineSince = new Date(
      now.getTime() - 2 * 60 * 1000
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      onlineNow,
      todayVisits,
      trafficStats,
    ] = await Promise.all([
      sessions.countDocuments({
        lastSeen: {
          $gte: onlineSince,
        },
      }),

      sessions.countDocuments({
        createdAt: {
          $gte: startOfToday,
        },
      }),

      stats.findOne({
        _id: "global",
      }),
    ]);

    return res.status(200).json({
      success: true,

      traffic: {
        onlineNow,

        todayVisits,

        totalVisits:
          Number(
            trafficStats?.totalVisits || 0
          ),

        peakOnline:
          Number(
            trafficStats?.peakOnline || 0
          ),

        peakAt:
          trafficStats?.peakAt || null,
      },
    });
  } catch (error) {
    console.error(
      "Traffic Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load traffic analytics",
    });
  }
};

// =====================================================
// PUBLIC WEBSITE STATISTICS
// =====================================================

export const getPublicStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const active = {
      isActive: {
        $ne: false,
      },
    };

    const [
      members,
      pressReleases,
      events,
    ] = await Promise.all([
      ExecutiveCommittee.countDocuments({
        status: "active",
      }),

      PressRelease.countDocuments({
        ...active,
        status: "PUBLISHED",
      }),

      Event.countDocuments({
        ...active,
        status: "published",
      }),
    ]);

    res.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );

    res.status(200).json({
      members,
      pressReleases,
      events,
    });
  } catch (error) {
    console.error(
      "Public Stats Error:",
      error
    );

    res.status(500).json({
      members: 0,
      pressReleases: 0,
      events: 0,
    });
  }
};
