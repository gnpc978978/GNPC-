import { Request, Response } from "express";

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
    console.error(
      "Dashboard Error:",
      error
    );

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
    // If a year is provided in the query, use it.
    // Otherwise use the current year.
    //
    // Example:
    // /api/dashboard/charts?year=2026

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


    // =================================================
    // GET MONTHLY DATA
    // =================================================

    const [
      pressReleases,
      events,
      gallery,
    ] = await Promise.all([

      // -----------------------------------------------
      // PRESS RELEASES
      // -----------------------------------------------

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


      // -----------------------------------------------
      // EVENTS
      // -----------------------------------------------

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


      // -----------------------------------------------
      // GALLERY
      // -----------------------------------------------

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


    // =================================================
    // MONTH NAMES
    // =================================================

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


    // =================================================
    // CREATE JANUARY - DECEMBER DATA
    // =================================================

    const data = months.map(
      (month, index) => {

        const monthNumber =
          index + 1;


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


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,

      year,

      data,
    });


  } catch (error) {

    console.error(
      "Charts Error:",
      error
    );


    res.status(500).json({
      success: false,

      message:
        "Failed to load dashboard charts",
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


    // Cache public statistics for 60 seconds.
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
