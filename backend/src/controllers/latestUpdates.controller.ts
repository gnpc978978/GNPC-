import { Request, Response } from "express";
import Announcement from "../models/announcement.model";
import Event from "../models/event.model";
import PressRelease from "../models/pressRelease.model";
import PressConference from "../models/PressConference";

export const getLatestUpdates = async (_req: Request, res: Response) => {
  try {
    // $ne keeps legacy records (created before isActive existed) publicly visible.
    const active = { isActive: { $ne: false } };

    const [
      pressReleases,
      announcements,
      events,
      pressConferences,
    ] = await Promise.all([
      PressRelease.find({ ...active, status: "PUBLISHED" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean(),
      Announcement.find({ ...active, status: "Published" })
        .sort({ createdAt: -1 })
        .lean(),
      Event.find({ ...active, status: "published" })
        .sort({ date: -1, createdAt: -1 })
        .lean(),
      PressConference.find()
        .sort({ date: -1, createdAt: -1 })
        .lean(),
    ]);

    const data = [
      ...pressReleases.map((item) => ({
        ...item,
        type: "Press Release",
        image: item.image || "",
        publishedAt: item.publishedAt || item.createdAt,
      })),
      ...announcements.map((item) => ({
        ...item,
        type: "Announcement",
        image: item.image || "",
        publishedAt: item.createdAt,
      })),
      ...events.map((item) => ({
        ...item,
        type: "Event",
        image: item.banner || "",
        publishedAt: item.date || item.createdAt,
      })),
      ...pressConferences.map((item) => ({
        ...item,
        type: "Press Conference",
        image: item.featuredImage || "",
        publishedAt: item.date || item.createdAt,
      })),
    ].sort((a, b) => {
      const getTime = (value: string | Date | undefined) => {
        if (!value) return 0;
        const time = new Date(value).getTime();
        return Number.isNaN(time) ? 0 : time;
      };

      return getTime(b.publishedAt) - getTime(a.publishedAt);
    });

    return res.status(200).json({
      success: true,
      data,
      pressReleases,
      announcements,
      events,
      pressConferences,
    });
  } catch (error) {
    console.error("Get Latest Updates Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest updates",
      data: [],
      pressReleases: [],
      announcements: [],
      events: [],
      pressConferences: [],
    });
  }
};
