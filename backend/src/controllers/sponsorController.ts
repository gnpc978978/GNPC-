import { Request, Response } from "express";
import Sponsor from "../models/Sponsor";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";


// GET ALL SPONSORS
export const getSponsors = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsors = await Sponsor.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: sponsors.length,
      data: sponsors,
    });
  } catch (error) {
    console.error("Get Sponsors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE SPONSOR
export const getSponsorById = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    console.error("Get Sponsor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// CREATE SPONSOR
export const createSponsor = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsor = await Sponsor.create({
  ...req.body,
  logo: req.file?.path || "",
});

    return res.status(201).json({
      success: true,
      message: "Sponsor created successfully",
      data: sponsor,
    });
  } catch (error) {
    console.error("Create Sponsor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE SPONSOR
export const updateSponsor = async (
  req: Request,
  res: Response
) => {
  try {
    const existingSponsor = await Sponsor.findById(req.params.id);

    if (!existingSponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
      });
    }

    const updateData: any = {
  ...req.body,
};

if (req.file) {
  updateData.logo = req.file.path;
}

const sponsor = await Sponsor.findByIdAndUpdate(
  req.params.id,
  updateData,
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
      });
    }

    if (req.file && existingSponsor.logo !== sponsor.logo) {
      await deleteCloudinaryAssets([existingSponsor.logo]);
    }

    return res.status(200).json({
      success: true,
      message: "Sponsor updated successfully",
      data: sponsor,
    });
  } catch (error) {
    console.error("Update Sponsor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE SPONSOR
export const deleteSponsor = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(
      req.params.id
    );

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
      });
    }

    await deleteCloudinaryAssets([sponsor.logo]);

    return res.status(200).json({
      success: true,
      message: "Sponsor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Sponsor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
