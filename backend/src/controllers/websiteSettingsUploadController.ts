import {
  Request,
  Response,
} from "express";
import mongoose from "mongoose";

import WebsiteSettings from "../models/WebsiteSettings";

import {
  deleteCloudinaryAssets,
} from "../utils/cloudinaryCleanup";

const isDevelopment =
  process.env.NODE_ENV !==
  "production";

const errorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (!isDevelopment) {
    return fallback;
  }

  if (
    error instanceof
    mongoose.Error.ValidationError
  ) {
    return Object.values(
      error.errors
    )
      .map(
        (item) =>
          item.message
      )
      .join(" ");
  }

  if (
    error instanceof
    mongoose.Error.CastError
  ) {
    return `Invalid value for ${error.path}: ${String(
      error.value
    )}.`;
  }

  return error instanceof Error
    ? error.message
    : fallback;
};

/*
 * ============================================================
 * HOME SECTION MEDIA
 * ============================================================
 *
 * Hero photos are intentionally excluded here because the Hero
 * carousel is managed by the existing Banner CMS.
 *
 * Supported fields:
 *
 * homeMedia_about_0
 * homeMedia_about_1
 *
 * homeMedia_objectives_0
 * homeMedia_objectives_1
 *
 * homeMedia_latestUpdates_0
 * ...
 *
 * Maximum 4 editorial photos per homepage section.
 */

const HOME_MEDIA_PATTERN =
  /^homeMedia_(about|objectives|latestUpdates|gallery|pressConferences|executiveCommittee|officeBearers|membership)_(\d+)$/;

const MAX_MEDIA_PER_SECTION = 4;

/*
 * ============================================================
 * UPLOAD WEBSITE SETTINGS FILES
 * ============================================================
 */

export const uploadSettingsFiles =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const files =
        (req.files ??
          []) as Express.Multer.File[];

      /*
       * --------------------------------------------------------
       * HELPERS
       * --------------------------------------------------------
       */

      const fileFor = (
        fieldName: string
      ) =>
        files.find(
          (file) =>
            file.fieldname ===
            fieldName
        );

      /*
       * --------------------------------------------------------
       * STANDARD WEBSITE SETTINGS FILES
       * --------------------------------------------------------
       */

      const logo =
        fileFor("logo");

      const favicon =
        fileFor("favicon");

      const heroImage =
        fileFor("heroImage");

      const aboutImage =
        fileFor("aboutImage");

      const membershipPdf =
        fileFor(
          "membershipPdf"
        );

      const scalarUpdates: Record<
        string,
        string
      > = {};

      if (logo?.path) {
        scalarUpdates.logo =
          logo.path;
      }

      if (favicon?.path) {
        scalarUpdates.favicon =
          favicon.path;
      }

      if (heroImage?.path) {
        scalarUpdates.heroImage =
          heroImage.path;
      }

      if (
        aboutImage?.path
      ) {
        scalarUpdates.aboutImage =
          aboutImage.path;
      }

      if (
        membershipPdf?.path
      ) {
        scalarUpdates.membershipPdf =
          membershipPdf.path;
      }

      /*
       * --------------------------------------------------------
       * HOME MEDIA FILES
       * --------------------------------------------------------
       */

      const homeMediaFiles: Array<{
        section: string;
        index: number;
        path: string;
      }> = [];

      for (
        const file of files
      ) {
        const match =
          HOME_MEDIA_PATTERN.exec(
            file.fieldname
          );

        if (!match) {
          continue;
        }

        const section =
          match[1];

        const index =
          Number(match[2]);

        if (
          !Number.isInteger(
            index
          ) ||
          index < 0 ||
          index >=
            MAX_MEDIA_PER_SECTION
        ) {
          return res
            .status(400)
            .json({
              success:
                false,

              message:
                `Invalid media position for ${section}.`,
            });
        }

        if (!file.path) {
          return res
            .status(400)
            .json({
              success:
                false,

              message:
                `Uploaded file for ${file.fieldname} has no Cloudinary path.`,
            });
        }

        homeMediaFiles.push({
          section,
          index,
          path: file.path,
        });
      }

      /*
       * --------------------------------------------------------
       * REJECT UNKNOWN FILE FIELDS
       * --------------------------------------------------------
       *
       * websiteSettingsUpload uses .any() because home media
       * fields are dynamic. We therefore validate every field
       * here before saving.
       * --------------------------------------------------------
       */

      const allowedScalarFields =
        new Set([
          "logo",
          "favicon",
          "heroImage",
          "aboutImage",
          "membershipPdf",
        ]);

      const unsupportedFields =
        files.filter(
          (file) => {
            const isKnownScalar =
              allowedScalarFields.has(
                file.fieldname
              );

            const isKnownHomeMedia =
              HOME_MEDIA_PATTERN.test(
                file.fieldname
              );

            return (
              !isKnownScalar &&
              !isKnownHomeMedia
            );
          }
        );

      if (
        unsupportedFields.length >
        0
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              `Unsupported upload field: ${unsupportedFields[0].fieldname}`,
          });
      }

      /*
       * --------------------------------------------------------
       * NOTHING UPLOADED
       * --------------------------------------------------------
       */

      if (
        Object.keys(
          scalarUpdates
        ).length === 0 &&
        homeMediaFiles.length ===
          0
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "No supported file was provided.",
          });
      }

      /*
       * --------------------------------------------------------
       * GET / CREATE SETTINGS DOCUMENT
       * --------------------------------------------------------
       */

      let settings =
        await WebsiteSettings.findOne();

      if (!settings) {
        settings =
          new WebsiteSettings();
      }

      const previousSettings =
        settings.toObject();

      /*
       * --------------------------------------------------------
       * EXISTING HOME SETTINGS
       * --------------------------------------------------------
       */

      const previousHome =
        (settings.home ||
          {}) as Record<
          string,
          unknown
        >;

      const nextHome: Record<
        string,
        unknown
      > = {
        ...previousHome,
      };

      /*
       * --------------------------------------------------------
       * MERGE NEW HOME MEDIA
       * --------------------------------------------------------
       *
       * Important:
       *
       * Uploading photo 2 does not erase photo 1.
       * Uploading a replacement at a given position replaces
       * that position.
       * --------------------------------------------------------
       */

      for (
        const item of homeMediaFiles
      ) {
        const currentSection =
          (
            nextHome[
              item.section
            ] ||
            {}
          ) as Record<
            string,
            unknown
          >;

        const currentMedia =
          Array.isArray(
            currentSection.media
          )
            ? [
                ...(
                  currentSection.media as string[]
                ),
              ]
            : [];

        /*
         * Expand array to target position.
         */

        while (
          currentMedia.length <=
          item.index
        ) {
          currentMedia.push(
            ""
          );
        }

        /*
         * Place uploaded Cloudinary URL.
         */

        currentMedia[
          item.index
        ] = item.path;

        /*
         * Remove empty entries and enforce maximum.
         */

        currentSection.media =
          currentMedia
            .filter(
              (
                value
              ) =>
                typeof value ===
                  "string" &&
                value
                  .trim()
                  .length >
                  0
            )
            .slice(
              0,
              MAX_MEDIA_PER_SECTION
            );

        nextHome[
          item.section
        ] =
          currentSection;
      }

      /*
       * --------------------------------------------------------
       * APPLY STANDARD FILE UPDATES
       * --------------------------------------------------------
       */

      if (
        Object.keys(
          scalarUpdates
        ).length > 0
      ) {
        Object.assign(
          settings,
          scalarUpdates
        );
      }

      /*
       * --------------------------------------------------------
       * APPLY HOME SETTINGS
       * --------------------------------------------------------
       *
       * IMPORTANT:
       *
       * Do NOT cast Record<string, unknown> to IHomeSettings.
       * WebsiteSettings.home is a MongoDB Mixed field.
       *
       * Mongoose's set() is the correct way to update it and
       * avoids the TS2352 build error.
       * --------------------------------------------------------
       */

      if (
        homeMediaFiles.length >
        0
      ) {
        settings.set(
          "home",
          nextHome
        );
      }

      /*
       * --------------------------------------------------------
       * SAVE
       * --------------------------------------------------------
       */

      await settings.save();

      /*
       * --------------------------------------------------------
       * CLEAN UP REPLACED STANDARD ASSETS
       * --------------------------------------------------------
       *
       * Home editorial media isn't deleted here because this
       * upload endpoint only adds/replaces uploaded positions.
       * Deletion of individual media entries can be handled by
       * the normal settings update flow.
       * --------------------------------------------------------
       */

      const oldScalarAssets =
        [
          scalarUpdates.logo
            ? previousSettings.logo
            : undefined,

          scalarUpdates.favicon
            ? previousSettings.favicon
            : undefined,

          scalarUpdates.heroImage
            ? previousSettings.heroImage
            : undefined,

          scalarUpdates.aboutImage
            ? previousSettings.aboutImage
            : undefined,

          scalarUpdates.membershipPdf
            ? previousSettings.membershipPdf
            : undefined,
        ].filter(
          (
            value
          ): value is string =>
            typeof value ===
              "string" &&
            value.length >
              0
        );

      if (
        oldScalarAssets.length >
        0
      ) {
        await deleteCloudinaryAssets(
          oldScalarAssets
        );
      }

      /*
       * --------------------------------------------------------
       * RESPONSE
       * --------------------------------------------------------
       */

      return res
        .status(200)
        .json({
          success:
            true,

          message:
            "Settings files uploaded successfully.",

          data: {
            ...settings.toObject(),

            home: settings.home,
          },
        });
    } catch (error) {
      console.error(
        "Website Settings Upload Error:",
        error
      );

      return res
        .status(500)
        .json({
          success:
            false,

          message:
            errorMessage(
              error,
              "File upload failed."
            ),
        });
    }
  };
