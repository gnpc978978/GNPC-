import {
  Request,
  Response,
} from "express";

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
  "ctaSecondaryHref",
] as const;

type AboutListItem = {
  title?: unknown;
  description?: unknown;
  icon?: unknown;
};

type UploadedFiles = {
  image?: Express.Multer.File[];
  presidentPhoto?: Express.Multer.File[];
  aboutMedia?: Express.Multer.File[];
};
const normalizeString = (
  value: unknown
) =>
  typeof value === "string"
    ? value.trim()
    : "";

const normalizeItems = (
  value: unknown,
  fieldName: string
) => {
  if (!Array.isArray(value)) {
    throw new Error(
      `${fieldName} must be an array.`
    );
  }

  return value.map(
    (item: AboutListItem) => ({
      title: normalizeString(
        item?.title
      ),

      description:
        normalizeString(
          item?.description
        ),

      icon: normalizeString(
        item?.icon
      ),
    })
  );
};

const getUploadedUrl = (
  file?: Express.Multer.File
) => {
  if (!file) {
    return "";
  }

  return String(
    file.path ||
      (file as any).secure_url ||
      (file as any).url ||
      ""
  ).trim();
};

const getOrCreateSettings =
  async () => {
    let settings =
      await AboutSettings.findOne();

    if (!settings) {
      settings =
        await AboutSettings.create({});
    }

    return settings;
  };

/**
 * GET /api/settings/about
 *
 * Public About CMS data.
 */
export const getAboutSettings =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const settings =
        await getOrCreateSettings();

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
 * Updates text/content only.
 *
 * Media must be uploaded through:
 *
 * POST /api/settings/about/upload
 */
export const updateAboutSettings =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const settings =
        await getOrCreateSettings();

      const body =
        req.body || {};

      /*
       * -----------------------------
       * STRING FIELDS
       * -----------------------------
       */
      for (const field of STRING_FIELDS) {
        if (
          body[field] !==
          undefined
        ) {
          if (
            typeof body[field] !==
            "string"
          ) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  `${field} must be a string.`,
              });
          }

          (
            settings as any
          )[field] =
            body[field].trim();
        }
      }

      /*
       * -----------------------------
       * OBJECTIVES
       * -----------------------------
       */
      if (
        body.objectives !==
        undefined
      ) {
        try {
          (
            settings as any
          ).objectives =
            normalizeItems(
              body.objectives,
              "Objectives"
            );
        } catch (error) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                error instanceof
                Error
                  ? error.message
                  : "Invalid objectives.",
            });
        }
      }

      /*
       * -----------------------------
       * WHY CHOOSE US / REASONS
       * -----------------------------
       */
      if (
        body.reasons !==
        undefined
      ) {
        try {
          (
            settings as any
          ).reasons =
            normalizeItems(
              body.reasons,
              "Why Choose Us items"
            );
        } catch (error) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                error instanceof
                Error
                  ? error.message
                  : "Invalid Why Choose Us items.",
            });
        }
      }

      /*
       * -----------------------------
       * MEDIA URL FIELDS
       *
       * These are accepted because
       * the frontend may receive an
       * already-uploaded URL and save
       * the returned settings object.
       * -----------------------------
       */
      for (const field of [
        "image",
        "presidentPhoto",
      ] as const) {
        if (
          body[field] !==
          undefined
        ) {
          if (
            typeof body[field] !==
            "string"
          ) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  `${field} must be a string.`,
              });
          }

          (
            settings as any
          )[field] =
            body[field].trim();
        }
      }

      await settings.save();

      const freshSettings =
        await AboutSettings.findOne();

      return res.status(200).json({
        success: true,
        message:
          "About page content updated successfully.",
        data: freshSettings,
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
 * Multipart/form-data.
 *
 * Supported fields:
 *
 * image
 * aboutMedia (up to 2 files)
 * presidentPhoto
 */
export const uploadAboutSettingsFiles =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const settings =
        await getOrCreateSettings();

      const files =
        (req.files as UploadedFiles) ||
        {};

      const imageFile =
        files.image?.[0];

      const presidentPhotoFile =
        files.presidentPhoto?.[0];

      if (
        !imageFile &&
        !presidentPhotoFile
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "No About image was uploaded.",
          });
      }

      /*
       * -----------------------------
       * ABOUT IMAGE
       * -----------------------------
       */
      if (imageFile) {
        const imageUrl =
          getUploadedUrl(
            imageFile
          );

        if (!imageUrl) {
          return res
            .status(500)
            .json({
              success: false,
              message:
                "About image uploaded but no Cloudinary URL was returned.",
            });
        }

        settings.image =
          imageUrl;
      }

      /*
       * -----------------------------
       * ADDITIONAL ABOUT MEDIA
       * -----------------------------
       */
      const additionalMedia =
        files.aboutMedia || [];

      if (
        additionalMedia.length >
        2
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "A maximum of 2 additional About photos is allowed.",
          });
      }

      if (
        additionalMedia.length >
        0
      ) {
        const uploadedMedia =
          additionalMedia
            .map(
              getUploadedUrl
            )
            .filter(Boolean);

        if (
          uploadedMedia.length !==
          additionalMedia.length
        ) {
          return res
            .status(500)
            .json({
              success: false,
              message:
                "One or more About photos uploaded without a Cloudinary URL.",
            });
        }

        settings.media =
          uploadedMedia;
      }

      /*
       * -----------------------------
       * PRESIDENT PHOTO
       * -----------------------------
       */
      if (
        presidentPhotoFile
      ) {
        const presidentPhotoUrl =
          getUploadedUrl(
            presidentPhotoFile
          );

        if (!presidentPhotoUrl) {
          return res
            .status(500)
            .json({
              success: false,
              message:
                "President photo uploaded but no Cloudinary URL was returned.",
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
