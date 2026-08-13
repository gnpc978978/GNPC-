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
      message:
        "Unable to fetch About page content.",
    });
  }
};

/**
 * PUT /api/settings/about
 *
 * Saves textual About page content.
 *
 * Images are NOT handled here.
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

    const body = req.body || {};

    /*
     * Text fields only.
     */
    const stringFields = [
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
    if (
      body.objectives !==
      undefined
    ) {
      if (
        !Array.isArray(
          body.objectives
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Objectives must be an array.",
        });
      }

      (settings as any).objectives =
        body.objectives.map(
          (item: any) => ({
            title: String(
              item?.title || ""
            ).trim(),

            description: String(
              item?.description || ""
            ).trim(),

            icon: String(
              item?.icon || ""
            ).trim(),
          })
        );
    }

    /*
     * Why Choose Us / Reasons
     */
    if (
      body.reasons !==
      undefined
    ) {
      if (
        !Array.isArray(
          body.reasons
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Why Choose Us items must be an array.",
        });
      }

      (settings as any).reasons =
        body.reasons.map(
          (item: any) => ({
            title: String(
              item?.title || ""
            ).trim(),

            description: String(
              item?.description || ""
            ).trim(),

            icon: String(
              item?.icon || ""
            ).trim(),
          })
        );
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
 * Cloudinary upload endpoint.
 *
 * Supported fields:
 *   image
 *   presidentPhoto
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
       * multer-storage-cloudinary puts the
       * Cloudinary delivery URL in `path`.
       *
       * IMPORTANT:
       * Do NOT save `destination`, `filename`,
       * or local filesystem paths here.
       */
      const getCloudinaryUrl = (
        file?: Express.Multer.File
      ): string => {
        if (!file) {
          return "";
        }

        return String(
          file.path || ""
        ).trim();
      };

      /*
       * Save About main image.
       */
      if (imageFile) {
        const imageUrl =
          getCloudinaryUrl(
            imageFile
          );

        if (!imageUrl) {
          return res.status(500).json({
            success: false,
            message:
              "Image uploaded but Cloudinary URL was not returned.",
          });
        }

        settings.image =
          imageUrl;
      }

      /*
       * Save President photo.
       */
      if (
        presidentPhotoFile
      ) {
        const presidentUrl =
          getCloudinaryUrl(
            presidentPhotoFile
          );

        if (!presidentUrl) {
          return res.status(500).json({
            success: false,
            message:
              "President photo uploaded but Cloudinary URL was not returned.",
          });
        }

        settings.presidentPhoto =
          presidentUrl;
      }

      await settings.save();

      /*
       * Return the fresh document.
       */
      const freshSettings =
        await AboutSettings.findOne();

      const uploadedUrl =
        getCloudinaryUrl(
          imageFile
        ) ||
        getCloudinaryUrl(
          presidentPhotoFile
        );

      return res.status(200).json({
        success: true,
        message:
          "About media uploaded successfully.",
        url: uploadedUrl,
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
