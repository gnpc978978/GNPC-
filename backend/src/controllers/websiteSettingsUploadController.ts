import { Request, Response } from "express";
import mongoose from "mongoose";

import WebsiteSettings from "../models/WebsiteSettings";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

const isDevelopment =
  process.env.NODE_ENV !== "production";

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

const HOME_MEDIA_PATTERN =
  /^homeMedia_(about|objectives|latestUpdates|gallery|pressConferences|executiveCommittee|officeBearers|membership)_(\d+)$/;

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
        fileFor("membershipPdf");

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

      if (aboutImage?.path) {
        updateData.aboutImage =
          aboutImage.path;
      }

      if (membershipPdf?.path) {
        updateData.membershipPdf =
          membershipPdf.path;
      }

      const homeMediaFiles: Array<{
        section: string;
        index: number;
        path: string;
      }> = [];

      for (const file of files) {
        const match =
          HOME_MEDIA_PATTERN.exec(
            file.fieldname
          );

        if (!match) {
          continue;
        }

        homeMediaFiles.push({
          section: match[1],
          index: Number(
            match[2]
          ),
          path: file.path,
        });
      }

      if (
        Object.keys(
          updateData
        ).length === 0 &&
        homeMediaFiles.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No supported file was provided.",
        });
      }

      const previousSettings =
        await WebsiteSettings.findOne();

      const previousHome =
        (previousSettings?.home ||
          {}) as Record<
          string,
          unknown
        >;

      const nextHome = {
        ...previousHome,
      };

      for (const item of homeMediaFiles) {
        const currentSection =
          (
            nextHome[
              item.section
            ] || {}
          ) as Record<
            string,
            unknown
          >;

        const currentMedia =
          Array.isArray(
            currentSection.media
          )
            ? [
                ...(currentSection.media as string[]),
              ]
            : [];

        currentMedia[
          item.index
        ] = item.path;

        currentSection.media =
          currentMedia.filter(
            (value) =>
              typeof value ===
                "string" &&
              value.trim()
                .length > 0
          );

        nextHome[
          item.section
        ] = currentSection;
      }

      const setOperations: Record<
        string,
        unknown
      > = {
        ...updateData,
      };

      if (
        homeMediaFiles.length > 0
      ) {
        setOperations.home =
          nextHome;
      }

      const settings =
        await WebsiteSettings.findOneAndUpdate(
          {},
          {
            $set: setOperations,
          },
          {
            returnDocument:
              "after",
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert:
              true,
          }
        );

      await deleteCloudinaryAssets([
        updateData.logo
          ? previousSettings?.logo
          : undefined,
        updateData.favicon
          ? previousSettings?.favicon
          : undefined,
        updateData.heroImage
          ? previousSettings?.heroImage
          : undefined,
        updateData.aboutImage
          ? previousSettings?.aboutImage
          : undefined,
        updateData.membershipPdf
          ? previousSettings?.membershipPdf
          : undefined,
      ]);

      return res.status(200).json({
        success: true,
        message:
          "Settings files uploaded successfully.",
        data: settings,
      });
    } catch (error) {
      console.error(
        "Website Settings Update Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: errorMessage(
          error,
          "File upload failed."
        ),
      });
    }
  };
