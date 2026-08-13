import { Request, Response } from "express";
import AboutSettings from "../models/AboutSettings";

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

    const body = req.body || {};

    /*
     * Simple string fields
     */
    const stringFields = [
      "heroEyebrow",
      "heroTitle",
      "heroDescription",

      "image",
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
      "presidentPhoto",

      "whyChooseUsEyebrow",
      "whyChooseUsTitle",
      "whyChooseUsDescription",

      "ctaTitle",
      "ctaDescription",
      "ctaPrimaryLabel",
      "ctaSecondaryLabel",
    ] as const;

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        (settings as any)[field] =
          typeof body[field] === "string"
            ? body[field].trim()
            : String(body[field]);
      }
    }

    /*
     * Objectives
     */
    if (body.objectives !== undefined) {
      if (!Array.isArray(body.objectives)) {
        return res.status(400).json({
          success: false,
          message: "Objectives must be an array.",
        });
      }

      (settings as any).objectives =
        body.objectives.map((item: any) => ({
          title: String(
            item?.title || ""
          ).trim(),

          description: String(
            item?.description || ""
          ).trim(),

          icon: String(
            item?.icon || ""
          ).trim(),
        }));
    }

    /*
     * Why Choose Us / Reasons
     */
    if (body.reasons !== undefined) {
      if (!Array.isArray(body.reasons)) {
        return res.status(400).json({
          success: false,
          message:
            "Why Choose Us items must be an array.",
        });
      }

      (settings as any).reasons =
        body.reasons.map((item: any) => ({
          title: String(
            item?.title || ""
          ).trim(),

          description: String(
            item?.description || ""
          ).trim(),

          icon: String(
            item?.icon || ""
          ).trim(),
        }));
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
      message:
        "Unable to update About page content.",
    });
  }
};

/**
 * POST /api/settings/about/upload
 *
 * Supports:
 *   image
 *   presidentPhoto
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

    const imageFile =
      files?.image?.[0];

    const presidentPhotoFile =
      files?.presidentPhoto?.[0];

    if (!imageFile && !presidentPhotoFile) {
      return res.status(400).json({
        success: false,
        message: "No image was uploaded.",
      });
    }

    /*
     * Your project uses Multer's standard File type.
     *
     * Do NOT access:
     *   file.url
     *   file.secure_url
     *
     * Those are not part of Express.Multer.File.
     *
     * The upload middleware gives us the local
     * uploaded file path.
     */
    const getFileUrl = (
      file?: Express.Multer.File
    ): string => {
      if (!file) {
        return "";
      }

      /*
       * Multer disk storage:
       * file.path is the actual uploaded file path.
       */
      return file.path || "";
    };

    if (imageFile) {
      settings.image =
        getFileUrl(imageFile);
    }

    if (presidentPhotoFile) {
      settings.presidentPhoto =
        getFileUrl(
          presidentPhotoFile
        );
    }

    await settings.save();

    const uploadedUrl =
      getFileUrl(imageFile) ||
      getFileUrl(
        presidentPhotoFile
      );

    return res.status(200).json({
      success: true,
      message:
        "About image uploaded successfully.",
      data: settings,
      url: uploadedUrl,
    });
  } catch (error) {
    console.error(
      "Failed to upload About settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to upload About page image.",
    });
  }
};
