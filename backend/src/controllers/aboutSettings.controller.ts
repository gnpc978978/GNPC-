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

type AboutItem = {
  title?: unknown;
  description?: unknown;
  icon?: unknown;
};

const normalizeItems = (
  value: unknown,
  fieldName: string
) => {
  if (!Array.isArray(value)) {
    throw new Error(
      `${fieldName} must be an array.`
    );
  }

  return value.map((item: AboutItem) => ({
    title: String(item?.title ?? "").trim(),
    description: String(
      item?.description ?? ""
    ).trim(),
    icon: String(item?.icon ?? "").trim(),
  }));
};

const getUploadedUrl = (
  file?: Express.Multer.File
): string => {
  if (!file) {
    return "";
  }

  /*
   * multer-storage-cloudinary exposes the
   * Cloudinary delivery URL through `path`.
   */
  return String(file.path ?? "").trim();
};

/**
 * GET /api/settings/about
 *
 * Public endpoint.
 */
export const getAboutSettings = async (
  _req: Request,
  res: Response
) => {
  try {
    let settings =
      await AboutSettings.findOne();

    /*
     * Create the single About settings document
     * if this is the first request.
     */
    if (!settings) {
      settings =
        await AboutSettings.create({});
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
      message:
        "Unable to fetch About page content.",
    });
  }
};

/**
 * PUT /api/settings/about
 *
 * Updates JSON/text content only.
 *
 * Do not send files to this endpoint.
 */
export const updateAboutSettings = async (
  req: Request,
  res: Response
) => {
  try {
    let settings =
      await AboutSettings.findOne();

    if (!settings) {
      settings =
        new AboutSettings();
    }

    const body = req.body ?? {};

    /*
     * Update normal string fields.
     */
    for (const field of STRING_FIELDS) {
      if (body[field] !== undefined) {
        if (
          typeof body[field] !== "string"
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${field} must be a string.`,
          });
        }

        (settings as any)[field] =
          body[field].trim();
      }
    }

    /*
     * Update objectives.
     */
    if (body.objectives !== undefined) {
      try {
        (settings as any).objectives =
          normalizeItems(
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

    /*
     * Update Why Choose Us / reasons.
     */
    if (body.reasons !== undefined) {
      try {
        (settings as any).reasons =
          normalizeItems(
            body.reasons,
            "Why Choose Us items"
          );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Invalid Why Choose Us items.",
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
      message:
        "Unable to update About page content.",
    });
  }
};

/**
 * POST /api/settings/about/upload
 *
 * Multipart/form-data only.
 *
 * Supported fields:
 * - image
 * - presidentPhoto
 */
export const uploadAboutSettingsFiles =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      let settings =
        await AboutSettings.findOne();

      if (!settings) {
        settings =
          new AboutSettings();
      }

      const files =
        req.files as
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

      if (
        !imageFile &&
        !presidentPhotoFile
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No About image was uploaded.",
        });
      }

      /*
       * Main About image.
       */
      if (imageFile) {
        const imageUrl =
          getUploadedUrl(imageFile);

        if (!imageUrl) {
          return res.status(500).json({
            success: false,
            message:
              "About image uploaded but Cloudinary did not return a URL.",
          });
        }

        settings.image = imageUrl;
      }

      /*
       * President photo.
       */
      if (presidentPhotoFile) {
        const presidentPhotoUrl =
          getUploadedUrl(
            presidentPhotoFile
          );

        if (!presidentPhotoUrl) {
          return res.status(500).json({
            success: false,
            message:
              "President photo uploaded but Cloudinary did not return a URL.",
          });
        }

        settings.presidentPhoto =
          presidentPhotoUrl;
      }

      await settings.save();

      const freshSettings =
        await AboutSettings.findOne();

      return res.status(200).json({
        success: true,
        message:
          "About media uploaded successfully.",
        data: freshSettings,
      });
    } catch (error) {
      console.error(
        "Failed to upload About media:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to upload About page media.",
      });
    }
  };
