import { Request, Response } from "express";
import Announcement from "../models/announcement.model";
import mongoose from "mongoose";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

// Create Announcement
export const createAnnouncement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const announcement = await Announcement.create({
      ...req.body,
      slug: req.body.slug || `${req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`,
      image: req.file ? (req.file as any).path : "",
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error: any) {
    console.error("Create Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create announcement",
      error:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    });
  }
};

// Get All Announcements
export const getAnnouncements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, status } = req.query;

    const filter: any = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      filter.status = status;
    }

    const announcements = await Announcement.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error: any) {
    console.error("Get Announcements Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch announcements",
    });
  }
};

// Get Single Announcement
export const getAnnouncement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const announcement = await Announcement.findOne(
      mongoose.isValidObjectId(req.params.id)
        ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
        : { slug: req.params.id }
    );

    if (!announcement) {
      res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error: any) {
    console.error("Get Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch announcement",
    });
  }
};

// Update Announcement
export const updateAnnouncement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingAnnouncement = await Announcement.findById(req.params.id);

    if (!existingAnnouncement) {
      res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
      return;
    }

    const data: any = {
      ...req.body,
    };

    if (req.file) {
      data.image = (req.file as any).path;
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      data,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!announcement) {
      res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
      return;
    }

    if (
      req.file &&
      existingAnnouncement.image &&
      existingAnnouncement.image !== announcement.image
    ) {
      await deleteCloudinaryAssets([existingAnnouncement.image]);
    }

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error: any) {
    console.error("Update Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update announcement",
    });
  }
};

// Delete Announcement
export const deleteAnnouncement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
      return;
    }

    if (announcement.image) {
      await deleteCloudinaryAssets([announcement.image]);
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete announcement",
    });
  }
};
