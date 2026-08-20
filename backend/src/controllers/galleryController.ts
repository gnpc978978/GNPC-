import { createActivity } from "../services/activity.service";
import { Request, Response } from "express";
import Gallery from "../models/Gallery";
import cloudinary from "../config/cloudinary";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

type UploadedFiles = {
  [fieldname: string]: Express.Multer.File[];
};

const uploadBuffer = (
  buffer: Buffer,
  folder: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result.secure_url);
      }
    ).end(buffer);
  });

const getFiles = (req: Request): UploadedFiles =>
  (req.files || {}) as UploadedFiles;

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

export const createGallery = async (req: Request, res: Response) => {
  try {
    const files = getFiles(req);
    const coverFile = files.coverImage?.[0];

    if (!coverFile) {
      return res.status(400).json({
        success: false,
        message: "A cover image is required.",
      });
    }

    const coverImage = await uploadBuffer(
      coverFile.buffer,
      "gallery/covers"
    );

    const images = files.images?.length
      ? await Promise.all(
          files.images.map((file) =>
            uploadBuffer(file.buffer, "gallery/images")
          )
        )
      : [];

    const gallery = await Gallery.create({
      title: getString(req.body.title),
      coverImage,
      images,
      category: getString(req.body.category),
      description: getString(req.body.description),
      status:
        req.body.status === "inactive"
          ? "inactive"
          : "active",
    });

    await createActivity({
      user: (req as any).user.id,
      action: "CREATE",
      module: "GALLERY",
      description: `Created gallery album "${gallery.title}"`,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error) {
    console.error("GALLERY CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gallery upload failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getGallery = async (_req: Request, res: Response) => {
  try {
    const gallery = await Gallery.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      gallery,
      data: gallery,
    });
  } catch (error) {
    console.error("GALLERY FETCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
      gallery: [],
      data: [],
    });
  }
};

export const updateGallery = async (req: Request, res: Response) => {
  try {
    const existing = await Gallery.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const files = getFiles(req);
    const uploadedCover = files.coverImage?.[0];
    const uploadedImages = files.images || [];

    const update: Record<string, unknown> = {};

    if (typeof req.body.title === "string") {
      update.title = req.body.title.trim();
    }

    if (typeof req.body.category === "string") {
      update.category = req.body.category.trim();
    }

    if (typeof req.body.description === "string") {
      update.description = req.body.description.trim();
    }

    if (req.body.status === "active" || req.body.status === "inactive") {
      update.status = req.body.status;
    }

    let newCoverImage: string | undefined;
    if (uploadedCover) {
      newCoverImage = await uploadBuffer(
        uploadedCover.buffer,
        "gallery/covers"
      );
      update.coverImage = newCoverImage;
    }

    if (uploadedImages.length > 0) {
      const newImages = await Promise.all(
        uploadedImages.map((file) =>
          uploadBuffer(file.buffer, "gallery/images")
        )
      );

      // New uploaded images replace the existing album image list.
      update.images = newImages;
    }

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      update,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const assetsToDelete: Array<string | undefined> = [];

    if (newCoverImage && existing.coverImage) {
      assetsToDelete.push(existing.coverImage);
    }

    if (uploadedImages.length > 0) {
      assetsToDelete.push(...existing.images);
    }

    await deleteCloudinaryAssets(assetsToDelete);

    await createActivity({
      user: (req as any).user.id,
      action: "UPDATE",
      module: "GALLERY",
      description: `Updated gallery album "${gallery.title}"`,
    });

    return res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    console.error("GALLERY UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gallery update failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteGallery = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    await deleteCloudinaryAssets([
      gallery.coverImage,
      ...gallery.images,
    ]);

    await createActivity({
      user: (req as any).user.id,
      action: "DELETE",
      module: "GALLERY",
      description: `Deleted gallery album "${gallery.title}"`,
    });

    return res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    console.error("GALLERY DELETE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gallery delete failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
