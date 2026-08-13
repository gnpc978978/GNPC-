import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { Request } from "express";
import cloudinary from "../config/cloudinary";

const allowedFileExtensions =
  /\.(jpe?g|png|webp|pdf)$/i;

const allowedMimeTypes =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ]);

const createStorage = (
  folder: string
) =>
  new CloudinaryStorage({
    cloudinary,

    params: (
      _req: Request,
      file: Express.Multer.File
    ) => ({
      folder,

      resource_type:
        file.mimetype ===
        "application/pdf"
          ? "raw"
          : "image",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "pdf",
      ],
    }),
  });

const createUploader = (
  folder: string
) =>
  multer({
    storage:
      createStorage(folder),

    limits: {
      fileSize:
        10 * 1024 * 1024,
      files: 10,
    },

    fileFilter: (
      _req,
      file,
      callback
    ) => {
      const extensionAllowed =
        allowedFileExtensions.test(
          file.originalname
        );

      const mimeAllowed =
        allowedMimeTypes.has(
          file.mimetype
        );

      if (
        extensionAllowed &&
        mimeAllowed
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "Only JPG, PNG, WebP, and PDF files up to 10 MB are allowed."
        )
      );
    },
  });

export const pressReleaseUpload =
  createUploader(
    "press-releases"
  );

export const pressConferenceUpload =
  createUploader(
    "press-conferences"
  );

export const announcementUpload =
  createUploader(
    "announcements"
  );

export const eventUpload =
  createUploader("events");

export const galleryUpload =
  createUploader("gallery");

export const executiveUpload =
  createUploader(
    "executive-members"
  );

export const sponsorUpload =
  createUploader("sponsors");

export const websiteSettingsUpload =
  createUploader(
    "website-settings"
  );

export const aboutSettingsUpload =
  createUploader(
    "website-settings/about"
  );

export const bannerUpload =
  createUploader(
    "homepage-banners"
  );
