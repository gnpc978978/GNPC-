import { Request, Response } from "express";
import PressConference from "../models/PressConference";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

type UploadedFiles = {
  [fieldname: string]: Express.Multer.File[];
};

const getValidatedFields = (body: Request["body"]) => {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const venue = typeof body.venue === "string" ? body.venue.trim() : "";
  const date = typeof body.date === "string" ? body.date : "";

  if (!title || !venue || !date || Number.isNaN(Date.parse(date))) {
    return null;
  }

  return {
    title,
    venue,
    date: new Date(date),
    description: typeof body.description === "string" ? body.description.trim() : "",
    content: typeof body.content === "string" ? body.content : "",
  };
};

const getFileUrl = (files: UploadedFiles, fieldName: string): string | undefined =>
  files[fieldName]?.[0]?.path;

export const createPressConference = async (req: Request, res: Response) => {
  try {
    const fields = getValidatedFields(req.body);

    if (!fields) {
      return res.status(400).json({
        success: false,
        message: "Title, venue, and a valid date are required.",
      });
    }

    const files = (req.files || {}) as UploadedFiles;
    const pressConference = await PressConference.create({
      ...fields,
      featuredImage: getFileUrl(files, "featuredImage") || "",
      pdfFile: getFileUrl(files, "pdfFile") || "",
    });

    return res.status(201).json({ success: true, data: pressConference });
  } catch (error) {
    console.error("Create Press Conference Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create press conference." });
  }
};

export const getPressConferences = async (_req: Request, res: Response) => {
  try {
    const pressConferences = await PressConference.find().sort({ date: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: pressConferences });
  } catch (error) {
    console.error("Get Press Conferences Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch press conferences." });
  }
};

export const getPressConference = async (req: Request, res: Response) => {
  try {
    const pressConference = await PressConference.findById(req.params.id);

    if (!pressConference) {
      return res.status(404).json({ success: false, message: "Press conference not found." });
    }

    return res.status(200).json({ success: true, data: pressConference });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid press conference id." });
  }
};

export const updatePressConference = async (req: Request, res: Response) => {
  try {
    const fields = getValidatedFields(req.body);

    if (!fields) {
      return res.status(400).json({
        success: false,
        message: "Title, venue, and a valid date are required.",
      });
    }

    const existing = await PressConference.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Press conference not found." });
    }

    const files = (req.files || {}) as UploadedFiles;
    const featuredImage = getFileUrl(files, "featuredImage");
    const pdfFile = getFileUrl(files, "pdfFile");
    const pressConference = await PressConference.findByIdAndUpdate(
      req.params.id,
      {
        ...fields,
        ...(featuredImage ? { featuredImage } : {}),
        ...(pdfFile ? { pdfFile } : {}),
      },
      { returnDocument: "after", runValidators: true }
    );

    await deleteCloudinaryAssets([
      featuredImage && existing.featuredImage !== featuredImage ? existing.featuredImage : undefined,
      pdfFile && existing.pdfFile !== pdfFile ? existing.pdfFile : undefined,
    ]);

    return res.status(200).json({ success: true, data: pressConference });
  } catch (error) {
    console.error("Update Press Conference Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update press conference." });
  }
};

export const deletePressConference = async (req: Request, res: Response) => {
  try {
    const pressConference = await PressConference.findByIdAndDelete(req.params.id);

    if (!pressConference) {
      return res.status(404).json({ success: false, message: "Press conference not found." });
    }

    await deleteCloudinaryAssets([pressConference.featuredImage, pressConference.pdfFile]);
    return res.status(200).json({ success: true, message: "Press conference deleted successfully." });
  } catch (error) {
    console.error("Delete Press Conference Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete press conference." });
  }
};
