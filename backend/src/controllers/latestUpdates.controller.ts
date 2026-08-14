import { Request, Response } from "express";
import Announcement from "../models/announcement.model";
import Event from "../models/event.model";
import PressRelease from "../models/pressRelease.model";
import PressConference from "../models/PressConference";

export const getLatestUpdates = async (_req: Request, res: Response) => {
  try {
    // $ne keeps legacy records (created before isActive existed) publicly visible.
    const active = { isActive: { $ne: false } };
    const [pressReleases, announcements, events, pressConferences] = await Promise.all([
      PressRelease.find({ ...active, status: "PUBLISHED" }).sort({ publishedAt: -1, createdAt: -1 }).lean(),
      Announcement.find({ ...active, status: "Published" }).sort({ createdAt: -1 }).lean(),
      Event.find({ ...active, status: "published" }).sort({ createdAt: -1 }).lean(),
      PressConference.find().sort({ date: -1, createdAt: -1 }).lean(),
    ]);

    res.status(200).json({
      success: true,
      pressReleases,
      announcements,
      events,
      pressConferences,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch latest updates" });
  }
};
