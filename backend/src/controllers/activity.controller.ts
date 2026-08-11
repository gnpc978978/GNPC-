import { Request, Response } from "express";
import Activity from "../models/activity.model";

export const getActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(50);

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin activities:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV !== "production" &&
        error instanceof Error
          ? error.message
          : "Failed to fetch activities",
    });
  }
};
