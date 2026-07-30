import { Request, Response } from "express";
import mongoose from "mongoose";
import WebsiteSettings from "../models/WebsiteSettings";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

const isDevelopment = process.env.NODE_ENV !== "production";
const errorMessage = (error: unknown, fallback: string): string => {
  if (!isDevelopment) return fallback;
  if (error instanceof mongoose.Error.ValidationError) return Object.values(error.errors).map((item) => item.message).join(" ");
  if (error instanceof mongoose.Error.CastError) return `Invalid value for ${error.path}: ${String(error.value)}.`;
  return error instanceof Error ? error.message : fallback;
};


// UPLOAD SETTINGS FILES

export const uploadSettingsFiles = async (
  req: Request,
  res: Response
) => {

  try {


    const files =
      (req.files ?? {}) as {
        [fieldname:string]: Express.Multer.File[]
      };



    const updateData:any = {};



    if(files.logo?.[0]?.path){

      updateData.logo =
      files.logo[0].path;

    }



    if(files.favicon?.[0]?.path){

      updateData.favicon =
      files.favicon[0].path;

    }



    if(files.heroImage?.[0]?.path){

      updateData.heroImage =
      files.heroImage[0].path;

    }

    if(files.aboutImage?.[0]?.path){
      updateData.aboutImage = files.aboutImage[0].path;
    }



    if(files.membershipPdf?.[0]?.path){

      updateData.membershipPdf =
      files.membershipPdf[0].path;

    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No supported file was provided." });
    }

    const previousSettings = await WebsiteSettings.findOne();

    const settings = await WebsiteSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await deleteCloudinaryAssets([
      updateData.logo ? previousSettings?.logo : undefined,
      updateData.favicon ? previousSettings?.favicon : undefined,
      updateData.heroImage ? previousSettings?.heroImage : undefined,
      updateData.aboutImage ? previousSettings?.aboutImage : undefined,
      updateData.membershipPdf ? previousSettings?.membershipPdf : undefined,
    ]);



    return res.status(200).json({

      success:true,

      message:
      "Settings files uploaded successfully",

      data:settings,

    });



  }
  catch(error){
    console.error("Website Settings Update Error:", error);
    return res.status(500).json({

      success:false,

      message: error instanceof Error ? error.message : errorMessage(error, "File upload failed"),

    });


  }

};
