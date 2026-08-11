import { Request, Response } from "express";
import mongoose from "mongoose";

import User from "../models/User";
import Event from "../models/Event";
import Gallery from "../models/Gallery";
import ExecutiveCommittee from "../models/ExecutiveCommittee";
import PressRelease from "../models/pressRelease.model";

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

    const events = await Event.countDocuments();

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

export const getDashboardCharts = async (
  req: Request,
  res: Response
) => {
  try {
    const requestedYear = Number(req.query.year);

    const year =
      Number.isInteger(requestedYear) &&
      requestedYear >= 2000 &&
      requestedYear <= 2100
        ? requestedYear
        : new Date().getFullYear();

    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const months = Array.from(
      { length: 12 },
      (_, index) => ({
        month: new Date(
          Date.UTC(year, index, 1)
        ).toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),

        pressReleases: 0,
        events: 0,
        gallery: 0,
      })
    );

    const [
      pressReleaseCounts,
      eventCounts,
      galleryCounts,
    ] = await Promise.all([
      PressRelease.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lt: end,
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
              $gte: start,
              $lt: end,
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
              $gte: start,
              $lt: end,
            },

            status: "active",
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

    pressReleaseCounts.forEach(
      (item: {
        _id: number;
        count: number;
      }) => {
        if (
          item._id >= 1 &&
          item._id <= 12
        ) {
          months[item._id - 1].pressReleases =
            item.count;
        }
      }
    );

    eventCounts.forEach(
      (item: {
        _id: number;
        count: number;
      }) => {
        if (
          item._id >= 1 &&
          item._id <= 12
        ) {
          months[item._id - 1].events =
            item.count;
        }
      }
    );

    galleryCounts.forEach(
      (item: {
        _id: number;
        count: number;
      }) => {
        if (
          item._id >= 1 &&
          item._id <= 12
        ) {
          months[item._id - 1].gallery =
            item.count;
        }
      }
    );

    res.status(200).json({
      success: true,
      year,
      data: months,
    });
  } catch (error) {
    console.error(
      "Charts Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard charts",
    });
  }
};

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
    res.status(500).json({
      members: 0,
      pressReleases: 0,
      events: 0,
    });
  }
};

/* =====================================================
   TRAFFIC TRACKING
   ===================================================== */

const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB connection is not ready"
    );
  }

  return {
    sessions: db.collection("traffic_sessions"),
    stats: db.collection("traffic_stats"),
  };
};

/* Public website heartbeat */

export const trackTraffic = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      sessions,
      stats,
    } = getTrafficCollections();

    const sessionId =
      typeof req.body?.sessionId === "string"
        ? req.body.sessionId.trim()
        : "";

    const page =
      typeof req.body?.page === "string"
        ? req.body.page.substring(0, 300)
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

    const onlineSince = new Date(
      now.getTime() -
        2 * 60 * 1000
    );

    const startOfToday = new Date();

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );

    const [
      onlineNow,
      todayVisits,
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
    ]);

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

      trafficStats =
        await stats.findOne({
          _id: "global",
        });
    } else {
      const updateData: {
        totalVisits?: number;
        peakOnline?: number;
        peakAt?: Date;
        updatedAt: Date;
      } = {
        updatedAt: now,
      };

      if (!existingSession) {
        updateData.totalVisits =
          Number(
            trafficStats.totalVisits || 0
          ) + 1;
      }

      if (
        onlineNow >
        Number(
          trafficStats.peakOnline || 0
        )
      ) {
        updateData.peakOnline =
          onlineNow;

        updateData.peakAt =
          now;
      }

      await stats.updateOne(
        {
          _id: "global",
        },
        {
          $set: updateData,
        }
      );

      trafficStats =
        await stats.findOne({
          _id: "global",
        });
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
            trafficStats?.peakOnline ||
              onlineNow
          ),

        peakAt:
          trafficStats?.peakAt ||
          now,
      },
    });
  } catch (error) {
    console.error(
      "Traffic Tracking Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to track traffic",
    });
  }
};

/* Admin traffic overview */

export const getTrafficAnalytics = async (
  _req: Request,
  res: Response
) => {
  try {
    const {
      sessions,
      stats,
    } = getTrafficCollections();

    const now = new Date();

    const onlineSince = new Date(
      now.getTime() -
        2 * 60 * 1000
    );

    const startOfToday = new Date();

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );

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
