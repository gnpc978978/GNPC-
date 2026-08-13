import { Request, Response } from "express";
import AboutSettings from "../models/AboutSettings";

const STRING_FIELDS = [
  "heroEyebrow",
  "heroTitle",
  "heroDescription",

  "heading",
  "description",
  "secondaryDescription",

  "commitmentTitle",
  "commitmentDescription",

  "foundationEyebrow",
  "foundationTitle",
  "foundationDescription",

  "missionTitle",
  "missionDescription",

  "visionTitle",
  "visionDescription",

  "objectivesEyebrow",
  "objectivesTitle",
  "objectivesDescription",

  "presidentName",
  "presidentDesignation",
  "presidentMessage",

  "whyChooseUsEyebrow",
  "whyChooseUsTitle",
  "whyChooseUsDescription",

  "ctaTitle",
  "ctaDescription",
  "ctaPrimaryLabel",
  "ctaSecondaryLabel",
] as const;

const normalizeArray = (
  value: unknown,
  fieldName: string
) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  return value.map((item: any) => ({
    title: String(item?.title ?? "").trim(),
    description: String(item?.description ?? "").trim(),
    icon: String(item?.icon ?? "").trim(),
  }));
};

/**
 * GET /api/settings/about
 */
export const getAboutSettings = async (
  _req: Request,
  res: Response
) => {
  try {
    let settings = await AboutSettings.findOne();

    if (!settings) {
      settings = await AboutSettings.create({});
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to fetch About settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch About page content.",
    });
  }
};

/**
 * PUT /api/settings/about
 *
 * JSON only.
 * Media uploads are handled by POST /about/upload.
 */
export const updateAboutSettings = async (
  req: Request,
  res: Response
) => {
  try {
    let settings = await AboutSettings.findOne();

    if (!settings) {
      settings = new AboutSettings();
    }

    const body = req.body ?? {};

    for (const field of STRING_FIELDS) {
      if (body[field] !== undefined) {
        const value = body[field];

        if (typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string.`,
          });
        }

        (settings as any)[field] = value.trim();
      }
    }

    if (body.objectives !== undefined) {
      try {
        (settings as any).objectives =
          normalizeArray(
            body.objectives,
            "Objectives"
          );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Invalid objectives.",
        });
      }
    }

    if (body.reasons !== undefined) {
      try {
        (settings as any).reasons =
          normalizeArray(
            body.reasons,
            "Why Choose Us items"
          );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Invalid reasons.",
        });
      }
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "About page content updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to update About settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update About page content.",
    });
  }
};

/**
 * POST /api/settings/about/upload
 *
 * Multipart/form-data
 *
 * Supported fields:
 * - image
 * - presidentPhoto
 */
export const uploadAboutSettingsFiles = async (
  req: Request,
  res: Response
) => {
  try {
    let settings = await AboutSettings.findOne();

    if (!settings) {
      settings = new AboutSettings();
    }

    const files = req.files as
      | {
          [fieldname: string]:
            | Express.Multer.File[]
            | undefined;
        }
      | undefined;

    const imageFile = files?.image?.[0];
    const presidentPhotoFile =
      files?.presidentPhoto?.[0];

    if (!imageFile && !presidentPhotoFile) {
      return res.status(400).json({
        success: false,
        message:
          "No About image was uploaded.",
      });
    }

    const getFileUrl = (
      file?: Express.Multer.File
    ) => {
      if (!file) {
        return "";
      }

      const uploadedFile =
        file as Express.Multer.File & {
          path?: string;
          secure_url?: string;
          url?: string;
        };

      return String(
        uploadedFile.secure_url ||
          uploadedFile.url ||
          uploadedFile.path ||
          ""
      ).trim();
    };

    if (imageFile) {
      const imageUrl =
        getFileUrl(imageFile);

      if (!imageUrl) {
        return res.status(500).json({
          success: false,
          message:
            "Image uploaded but no Cloudinary URL was returned.",
        });
      }

      settings.image = imageUrl;
    }

    if (presidentPhotoFile) {
      const presidentPhotoUrl =
        getFileUrl(presidentPhotoFile);

      if (!presidentPhotoUrl) {
        return res.status(500).json({
          success: false,
          message:
            "President photo uploaded but no Cloudinary URL was returned.",
        });
      }

      settings.presidentPhoto =
        presidentPhotoUrl;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "About media uploaded successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to upload About settings files:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to upload About page media.",
    });
  }
};
