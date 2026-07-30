import { Request, Response } from "express";
import mongoose from "mongoose";
import WebsiteSettings from "../models/WebsiteSettings";
import cloudinary from "../config/cloudinary";

const isDevelopment = process.env.NODE_ENV !== "production";

class SettingsPayloadError extends Error {}

const errorMessage = (error: unknown, fallback: string): string => {
  if (!isDevelopment) return fallback;
  if (error instanceof mongoose.Error.ValidationError) return Object.values(error.errors).map((item) => item.message).join(" ");
  if (error instanceof mongoose.Error.CastError) return `Invalid value for ${error.path}: ${String(error.value)}.`;
  return error instanceof Error ? error.message : fallback;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeSettingsUpdate = (body: unknown): Record<string, unknown> => {
  if (!isPlainObject(body)) return {};
  const allowed = new Set(["siteName", "heroTitle", "heroDescription", "email", "phone", "address", "socialLinks", "seo"]);
  const update = Object.fromEntries(Object.entries(body).filter(([key, value]) => allowed.has(key) && value !== undefined));
  if ("socialLinks" in update && !isPlainObject(update.socialLinks)) throw new SettingsPayloadError("socialLinks must be an object.");
  if (isPlainObject(update.socialLinks) && Object.entries(update.socialLinks).some(([key, value]) => !["facebook", "twitter", "instagram", "linkedin"].includes(key) || (value !== undefined && typeof value !== "string"))) throw new SettingsPayloadError("socialLinks may only contain string Facebook, Twitter, Instagram, and LinkedIn URLs.");
  if ("seo" in update && !isPlainObject(update.seo)) throw new SettingsPayloadError("seo must be an object.");
  if (isPlainObject(update.seo) && Object.entries(update.seo).some(([key, value]) => (key !== "title" && key !== "description" && key !== "keywords") || ((key === "title" || key === "description") && value !== undefined && typeof value !== "string") || (key === "keywords" && (!Array.isArray(value) || value.some((keyword) => typeof keyword !== "string"))))) throw new SettingsPayloadError("seo must contain only string title/description values and a string keywords array.");
  return update;
};

const getCloudinaryMembershipAsset = (assetUrl: string) => {
  try {
    const { hostname, pathname } = new URL(assetUrl);
    if (!hostname.endsWith("cloudinary.com")) return null;

    const parts = pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex < 1) return null;

    const resourceType = parts[uploadIndex - 1];
    if (resourceType !== "image" && resourceType !== "raw") return null;

    const assetParts = parts.slice(uploadIndex + 1);
    const versionIndex = assetParts.findIndex((part) => /^v\d+$/.test(part));
    const publicId = assetParts
      .slice(versionIndex === -1 ? 0 : versionIndex + 1)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    return publicId ? { publicId: decodeURIComponent(publicId), resourceType } : null;
  } catch {
    return null;
  }
};


// GET SETTINGS

export const getSettings = async (
  req: Request,
  res: Response
) => {

  try {

    let settings = await WebsiteSettings.findOneAndUpdate(
      {},
      { $setOnInsert: { siteName: "Greater Noida Press Club", socialLinks: {}, seo: {} } },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Preserve an existing upload created before the membershipPdf field was
    // introduced, then use membershipPdf as the single canonical field.
    const legacyMembershipPdf = settings ? (settings.toObject() as { membershipForm?: string }).membershipForm : undefined;
    if (settings && !settings.membershipPdf && legacyMembershipPdf) {
      settings = await WebsiteSettings.findOneAndUpdate(
        {},
        { $set: { membershipPdf: legacyMembershipPdf } },
        { returnDocument: "after", runValidators: true }
      ) as typeof settings;
    }


    return res.status(200).json({

      success:true,

      data:settings,

    });


  } catch(error){
    console.error(error);

    return res.status(500).json({

      success:false,

      message: errorMessage(error, "Server error"),

    });

  }

};

// This endpoint is the one public source for every membership-form button.
// It issues a fresh signed Cloudinary download URL, which also keeps legacy
// PDFs that were uploaded as image assets accessible.
export const downloadMembershipForm = async (req: Request, res: Response) => {
  try {
    const settings = await WebsiteSettings.findOne().lean();
    const membershipPdf = settings?.membershipPdf;

    if (!membershipPdf) {
      return res.status(404).json({ success: false, message: "The membership form is not available yet." });
    }

    const asset = getCloudinaryMembershipAsset(membershipPdf);
    if (!asset) {
      return res.status(500).json({ success: false, message: "The membership form storage location is invalid." });
    }

    const downloadUrl = cloudinary.utils.private_download_url(asset.publicId, "pdf", {
      resource_type: asset.resourceType as "image" | "raw",
      type: "upload",
      attachment: false,
    });

    return res.redirect(302, downloadUrl);
  } catch (error) {
    console.error("Membership form download error:", error);
    return res.status(500).json({ success: false, message: "Unable to open the membership form right now." });
  }
};




// UPDATE SETTINGS

export const updateSettings = async (
  req: Request,
  res: Response
) => {

  try {


    const update = normalizeSettingsUpdate(req.body);
    if (Object.keys(update).length === 0) return res.status(400).json({ success: false, message: "Provide at least one valid settings field." });
    if (typeof update.siteName === "string" && !update.siteName.trim()) {
      return res.status(400).json({ success: false, message: "Site name is required." });
    }
    if (typeof update.email === "string" && update.email && !/^\S+@\S+\.\S+$/.test(update.email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }
    const settings = await WebsiteSettings.findOneAndUpdate(
      {},
      { $set: update },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );



    return res.status(200).json({

      success:true,

      message:"Website settings updated successfully.",

      data:settings,

    });



  } catch(error){
    console.error("Website Settings Update Error:", error);

    if (error instanceof SettingsPayloadError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({

      success:false,

      message: error instanceof Error ? error.message : errorMessage(error, "Server error"),

    });


  }

};
