import { Request, Response } from "express";
import mongoose from "mongoose";
import Member from "../models/Member";
import PressRelease from "../models/pressRelease.model";
import Event from "../models/event.model";

/**
 * Get MongoDB database.
 */
const getDatabase = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  return db;
};

/**
 * Find the first existing collection from a list of possible names.
 *
 * This keeps the dashboard independent from Mongoose model filenames.
 */
const findCollection = async (
  names: string[]
) => {
  const db = getDatabase();

  const existingCollections =
    await db
      .listCollections()
      .toArray();

  const existingNames =
    new Set(
      existingCollections.map(
        (collection) =>
          collection.name
      )
    );

  for (const name of names) {
    if (existingNames.has(name)) {
      return db.collection(name);
    }
  }

  return null;
};

/**
 * Count documents safely.
 *
 * If a collection does not exist, return 0.
 */
const countCollection = async (
  names: string[],
  filter: Record<string, unknown> = {}
) => {
  const collection =
    await findCollection(names);

  if (!collection) {
    return 0;
  }

  return collection.countDocuments(
    filter
  );
};

/**
 * Traffic collections.
 */
const getTrafficCollections = () => {
  const db = getDatabase();

  return {
    sessions:
      db.collection(
        "traffic_sessions"
      ),

    stats:
      db.collection(
        "traffic_stats"
      ),
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
    // Use the actual Mongoose models rather than guessed collection names.
    // This keeps homepage figures aligned with the same public CMS records
    // visitors can read and includes the office-bearer collection.
    const [members, pressReleases, events] = await Promise.all([
      Member.countDocuments({ status: "active" }),
      PressRelease.countDocuments({ status: "PUBLISHED", isActive: { $ne: false } }),
      Event.countDocuments({ status: "published", isActive: { $ne: false } }),
    ]);

    return res.status(200).json({
      success: true,

      data: {
        members,
        pressReleases,
        events,
      },
    });
  } catch (error) {
    console.error(
      "getPublicStats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch public statistics.",
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
      typeof req.body?.path ===
      "string"
        ? req.body.path.trim()
        : "/";

    const userAgent =
      typeof req.headers[
        "user-agent"
      ] === "string"
        ? req.headers[
            "user-agent"
          ]
        : "";

    await sessions.insertOne({
      path: path || "/",
      userAgent,
      createdAt: now,
    });

    const date =
      now.toISOString().slice(
        0,
        10
      );

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
     * Analytics failure must never
     * break the public website.
     */
    return res.status(200).json({
      success: false,
    });
  }
};

/**
 * DASHBOARD STATS
 *
 * Frontend contract:
 *
 * data.stats.admins
 * data.stats.pressReleases
 * data.stats.events
 * data.stats.gallery
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
      countCollection(
        [
          "users",
          "admins",
          "admin_users",
        ],
        {
          role: {
            $in: [
              "ADMIN",
              "SUPER_ADMIN",
            ],
          },
        }
      ),

      countCollection([
        "press_releases",
        "pressReleases",
        "pressreleases",
      ]),

      countCollection([
        "events",
      ]),

      countCollection([
        "gallery",
        "galleries",
      ]),
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
       * Expected by the dashboard.
       */
      stats,

      /*
       * Compatibility with other
       * consumers.
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
 * Last 6 months.
 */
export const getDashboardCharts = async (
  _req: Request,
  res: Response
) => {
  try {
    const now = new Date();

    const months: Array<{
      month: string;
      start: Date;
      end: Date;
    }> = [];

    for (
      let i = 5;
      i >= 0;
      i--
    ) {
      const start =
        new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        );

      const end =
        new Date(
          now.getFullYear(),
          now.getMonth() - i + 1,
          1
        );

      months.push({
        month:
          start.toLocaleString(
            "en-IN",
            {
              month: "short",
            }
          ),

        start,
        end,
      });
    }

    const data =
      await Promise.all(
        months.map(
          async (item) => {
            const [
              pressReleases,
              pressConferences,
              events,
              gallery,
            ] =
              await Promise.all([
                countCollection(
                  [
                    "press_releases",
                    "pressReleases",
                    "pressreleases",
                  ],
                  {
                    createdAt: {
                      $gte:
                        item.start,
                      $lt:
                        item.end,
                    },
                  }
                ),

                countCollection(
                  [
                    "press_conferences",
                    "pressConferences",
                    "pressconference",
                    "press_conference",
                  ],
                  {
                    createdAt: {
                      $gte:
                        item.start,
                      $lt:
                        item.end,
                    },
                  }
                ),

                countCollection(
                  ["events"],
                  {
                    createdAt: {
                      $gte:
                        item.start,
                      $lt:
                        item.end,
                    },
                  }
                ),

                countCollection(
                  [
                    "gallery",
                    "galleries",
                  ],
                  {
                    createdAt: {
                      $gte:
                        item.start,
                      $lt:
                        item.end,
                    },
                  }
                ),
              ]);

            return {
              month:
                item.month,

              pressReleases,

              pressConferences,

              events,

              gallery,
            };
          }
        )
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
        dailyStats:
          dailyStats.reverse(),

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
