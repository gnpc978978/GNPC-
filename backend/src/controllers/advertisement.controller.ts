import { Request, Response } from "express";
import Advertisement from "../models/Advertisement";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

export const getAdvertisements = async (_req: Request, res: Response) => {
  const data = await Advertisement.find().sort({ createdAt: -1 });
  return res.json({ success: true, data });
};

export const getAdvertisement = async (req: Request, res: Response) => {
  const data = await Advertisement.findById(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: "Advertisement not found" });
  return res.json({ success: true, data });
};

export const createAdvertisement = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Banner image is required" });
  const data = await Advertisement.create({ ...req.body, banner: req.file.path });
  return res.status(201).json({ success: true, data });
};

export const updateAdvertisement = async (req: Request, res: Response) => {
  const existing = await Advertisement.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Advertisement not found" });
  const update = { ...req.body, ...(req.file ? { banner: req.file.path } : {}) };
  const data = await Advertisement.findByIdAndUpdate(req.params.id, update, { returnDocument: "after", runValidators: true });
  if (req.file && existing.banner !== data?.banner) await deleteCloudinaryAssets([existing.banner]);
  return res.json({ success: true, data });
};

export const deleteAdvertisement = async (req: Request, res: Response) => {
  const data = await Advertisement.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: "Advertisement not found" });
  await deleteCloudinaryAssets([data.banner]);
  return res.json({ success: true });
};
