import { Request, Response } from "express";

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

    const pressReleases = await PressRelease.countDocuments({ isActive: { $ne: false }, status: "PUBLISHED" });

    const events = await Event.countDocuments();

    const gallery = await Gallery.countDocuments();



    res.status(200).json({

      success: true,

      stats: {
        admins,
        pressReleases,
        events,
        gallery
      }

    });


  } catch(error) {

    console.error(
      "Dashboard Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:"Failed to load dashboard statistics"

    });

  }

};





export const getDashboardCharts = async (
  req: Request,
  res: Response
) => {

  try {


    const data = [
      {
        month:"Jan",
        pressReleases:0,
        events:0,
        gallery:0
      },
      {
        month:"Feb",
        pressReleases:0,
        events:0,
        gallery:0
      },
      {
        month:"Mar",
        pressReleases:0,
        events:0,
        gallery:0
      },
      {
        month:"Apr",
        pressReleases:0,
        events:0,
        gallery:0
      },
      {
        month:"May",
        pressReleases:0,
        events:0,
        gallery:0
      },
      {
        month:"Jun",
        pressReleases:0,
        events:0,
        gallery:0
      }
    ];



    res.status(200).json({

      success:true,

      data

    });



  } catch(error) {


    console.error(
      "Charts Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:"Failed to load dashboard charts"

    });


  }

};

export const getPublicStats = async (_req: Request, res: Response) => {
  try {
    const active = { isActive: { $ne: false } };
    const [members, pressReleases, events] = await Promise.all([
      ExecutiveCommittee.countDocuments({ status: "active" }),
      PressRelease.countDocuments({ ...active, status: "PUBLISHED" }),
      Event.countDocuments({ ...active, status: "published" }),
    ]);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.status(200).json({ members, pressReleases, events });
  } catch {
    res.status(500).json({ members: 0, pressReleases: 0, events: 0 });
  }
};
