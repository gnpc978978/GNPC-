import { Request, Response } from "express";
import Banner from "../models/Banner";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, data: banners });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch banners" });
  }
};

export const createBanners = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (!files.length) {
      return res.status(400).json({ success: false, message: "At least one banner image is required" });
    }

    const latest = await Banner.findOne().sort({ order: -1 }).select("order");
    const startingOrder = (latest?.order ?? -1) + 1;
    const banners = await Banner.insertMany(
      files.map((file, index) => ({ image: file.path, order: startingOrder + index, active: true }))
    );
    return res.status(201).json({ success: true, data: banners });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to upload banners" });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const existing = await Banner.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Banner not found" });

    const updates: { image?: string; active?: boolean } = {};
    if (req.file) updates.image = req.file.path;
    if (typeof req.body.active !== "undefined") updates.active = req.body.active === "true" || req.body.active === true;

    const banner = await Banner.findByIdAndUpdate(req.params.id, updates, { returnDocument: "after", runValidators: true });
    if (req.file && existing.image !== req.file.path) await deleteCloudinaryAssets([existing.image]);
    return res.json({ success: true, data: banner });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update banner" });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    await deleteCloudinaryAssets([banner.image]);
    return res.json({ success: true, message: "Banner deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete banner" });
  }
};

export const reorderBanners = async (req: Request, res: Response) => {
  const items = req.body.items;
  if (!Array.isArray(items) || items.some((item) => typeof item.id !== "string" || !Number.isInteger(item.order))) {
    return res.status(400).json({ success: false, message: "items must contain banner ids and integer order values" });
  }

  try {
    await Banner.bulkWrite(items.map((item) => ({ updateOne: { filter: { _id: item.id }, update: { $set: { order: item.order } } } })));
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, data: banners });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to save banner order" });
  }
};
