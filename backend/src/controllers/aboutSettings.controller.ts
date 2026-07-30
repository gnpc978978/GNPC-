import { Request, Response } from "express";
import AboutSettings from "../models/AboutSettings";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

const parseFeatures = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim());
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()) : [];
  } catch {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }
};

export const getAboutSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await AboutSettings.findOne().lean();
    res.set("Cache-Control", "no-cache, max-age=0, must-revalidate");
    res.status(200).json({ success: true, data: settings || { image: "", heading: "", description: "", features: [], presidentName: "", presidentDesignation: "", presidentMessage: "", presidentPhoto: "" } });
  } catch {
    res.status(500).json({ success: false, message: "Failed to load About settings" });
  }
};

export const updateAboutSettings = async (req: Request, res: Response) => {
  try {
    const heading = typeof req.body.heading === "string" ? req.body.heading.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
    const features = parseFeatures(req.body.features);
    const presidentName = typeof req.body.presidentName === "string" ? req.body.presidentName.trim() : "";
    const presidentDesignation = typeof req.body.presidentDesignation === "string" ? req.body.presidentDesignation.trim() : "";
    const presidentMessage = typeof req.body.presidentMessage === "string" ? req.body.presidentMessage.trim() : "";
    if (!heading || !description) return res.status(400).json({ success: false, message: "Heading and description are required" });

    const previous = await AboutSettings.findOne();
    const files = req.files as { image?: Array<Express.Multer.File & { path: string }>; presidentPhoto?: Array<Express.Multer.File & { path: string }> } | undefined;
    const image = files?.image?.[0]?.path || previous?.image;
    const presidentPhoto = files?.presidentPhoto?.[0]?.path || previous?.presidentPhoto;
    const settings = await AboutSettings.findOneAndUpdate({}, { heading, description, features, image, presidentName, presidentDesignation, presidentMessage, presidentPhoto }, { returnDocument: "after", upsert: true, runValidators: true });
    const obsolete = [files?.image?.[0] && previous?.image && previous.image !== image ? previous.image : "", files?.presidentPhoto?.[0] && previous?.presidentPhoto && previous.presidentPhoto !== presidentPhoto ? previous.presidentPhoto : ""].filter(Boolean) as string[];
    if (obsolete.length) await deleteCloudinaryAssets(obsolete);
    res.status(200).json({ success: true, message: "About settings updated successfully", data: settings });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update About settings" });
  }
};
