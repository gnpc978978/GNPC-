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
 * Only these Home sections are allowed to receive
 * Website Settings media uploads.
 *
 * Hero remains managed by the existing Banner CMS.
 */
const HOME_MEDIA_PATTERN =
  /^homeMedia_(about|objectives|latestUpdates|gallery|pressConferences|executiveCommittee|officeBearers|membership)_(\d+)$/;

const MAX_MEDIA_PER_SECTION = 4;

export const uploadSettingsFiles =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const files =
        (req.files ?? []) as Express.Multer.File[];

      const fileFor = (
        fieldName: string
      ) =>
        files.find(
          (file) =>
            file.fieldname ===
            fieldName
        );

      const updateData: Record<
        string,
        unknown
      > = {};

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

      if (logo?.path) {
        updateData.logo =
          logo.path;
      }

      if (favicon?.path) {
        updateData.favicon =
          favicon.path;
      }

      if (heroImage?.path) {
        updateData.heroImage =
          heroImage.path;
      }

      if (
        aboutImage?.path
      ) {
        updateData.aboutImage =
          aboutImage.path;
      }

      if (
        membershipPdf?.path
      ) {
        updateData.membershipPdf =
          membershipPdf.path;
      }

      /*
       * --------------------------------------------------------
       * HOME SECTION MEDIA
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

        homeMediaFiles.push({
          section,
          index,
          path:
            file.path,
        });
      }

      /*
       * Reject unsupported dynamic file fields.
       *
       * This prevents .any() from becoming an unrestricted
       * website-settings file mutation endpoint.
       */

      const unsupportedFields =
        files.filter(
          (file) => {
            const knownScalar =
              [
                "logo",
                "favicon",
                "heroImage",
                "aboutImage",
                "membershipPdf",
              ].includes(
                file.fieldname
              );

            const knownHomeMedia =
              HOME_MEDIA_PATTERN.test(
                file.fieldname
              );

            return (
              !knownScalar &&
              !knownHomeMedia
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
              "One or more uploaded fields are not supported by Website Settings.",
          });
      }

      if (
        Object.keys(
          updateData
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
       * HOME MEDIA MERGE
       * --------------------------------------------------------
       */

      const previousHome =
        (
          settings.home ||
          {}
        ) as Record<
          string,
          unknown
        >;

      const nextHome: Record<
        string,
        unknown
      > = {
        ...previousHome,
      };

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
         * Expand to the requested position.
         */

        while (
          currentMedia.length <=
          item.index
        ) {
          currentMedia.push(
            ""
          );
        }

        currentMedia[
          item.index
        ] = item.path;

        /*
         * Normalize empty values.
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
       * SAVE
       * --------------------------------------------------------
       */

      if (
        Object.keys(
          updateData
        ).length > 0
      ) {
        Object.assign(
          settings,
          updateData
        );
      }

      if (
        homeMediaFiles.length >
        0
      ) {
        settings.home =
          nextHome as typeof settings.home;
      }

      await settings.save();

      /*
       * --------------------------------------------------------
       * CLEAN UP REPLACED SCALAR ASSETS
       *
       * Section media order/remove operations are handled by
       * the JSON settings endpoint. We don't delete those here
       * because this endpoint only adds/uploads new media.
       * --------------------------------------------------------
       */

      await deleteCloudinaryAssets(
        [
          updateData.logo
            ? previousSettings.logo
            : undefined,

          updateData.favicon
            ? previousSettings.favicon
            : undefined,

          updateData.heroImage
            ? previousSettings.heroImage
            : undefined,

          updateData.aboutImage
            ? previousSettings.aboutImage
            : undefined,

          updateData.membershipPdf
            ? previousSettings.membershipPdf
            : undefined,
        ]
      );

      return res
        .status(200)
        .json({
          success:
            true,

          message:
            "Settings files uploaded successfully.",

          data: {
            ...settings.toObject(),
            home:
              settings.home,
          },
        });
    } catch (error) {
      console.error(
        "Website Settings Update Error:",
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
