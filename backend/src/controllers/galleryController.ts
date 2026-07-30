import { Request, Response } from "express";
import Gallery from "../models/Gallery";
import cloudinary from "../config/cloudinary";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";



// CREATE GALLERY

export const createGallery = async (
  req: Request,
  res: Response
) => {

  try {
console.log("BODY:", req.body);
console.log("FILES:", req.files);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };



    let coverImage = "";

    let images: string[] = [];





    // Upload Cover Image

    if (files?.coverImage?.length) {


      const coverUpload =
        await new Promise<any>((resolve, reject) => {


          cloudinary.uploader
            .upload_stream(

              {
                folder: "gallery/covers",
              },

              (error, result) => {

                if(error) {

                  reject(error);

                } else {

                  resolve(result);

                }

              }

            )
            .end(
              files.coverImage[0].buffer
            );


        });



      coverImage =
        coverUpload.secure_url;


    }





    // Upload Gallery Images

    if(files?.images?.length) {


      for(
        const file of files.images
      ) {


        const upload =
          await new Promise<any>((resolve, reject)=>{


            cloudinary.uploader
              .upload_stream(

                {
                  folder:"gallery/images",
                },

                (error,result)=>{

                  if(error){

                    reject(error);

                  } else {

                    resolve(result);

                  }

                }

              )
              .end(file.buffer);


          });



        images.push(
          upload.secure_url
        );


      }

    }





    const gallery =
      await Gallery.create({


        title:req.body.title,


        coverImage,


        images,


        category:req.body.category,


        description:
          req.body.description || "",


        status:
          req.body.status || "active",


      });





    return res.status(201).json({

      success:true,

      message:
        "Gallery created successfully",

      gallery,

    });





  } catch(error) {


    console.error(
      "GALLERY CREATE ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Gallery upload failed",

      error:
        error instanceof Error
          ? error.message
          : error,

    });


  }

};






// GET ALL GALLERY

export const getGallery = async (
  req: Request,
  res: Response
) => {


  try {


    const gallery =
      await Gallery.find()
      .sort({
        createdAt:-1,
      });



    return res.status(200).json({

      success:true,

      gallery,

    });



  } catch(error) {


    console.error(
      "GALLERY FETCH ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Failed to fetch gallery",

    });


  }

};






// UPDATE GALLERY

export const updateGallery = async (
  req: Request,
  res: Response
) => {


  try {


    const gallery =
      await Gallery.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          returnDocument: "after",
        }

      );



    if(!gallery) {

      return res.status(404).json({

        success:false,

        message:
          "Gallery not found",

      });

    }

    return res.status(200).json({

      success:true,

      message:
        "Gallery updated successfully",

      gallery,

    });





  } catch(error) {


    console.error(
      "GALLERY UPDATE ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Gallery update failed",

    });


  }

};






// DELETE GALLERY

export const deleteGallery = async (
  req: Request,
  res: Response
) => {


  try {


    const gallery =
      await Gallery.findByIdAndDelete(
        req.params.id
      );



    if(!gallery) {

      return res.status(404).json({

        success:false,

        message:
          "Gallery not found",

      });

    }

    await deleteCloudinaryAssets([
      gallery.coverImage,
      ...gallery.images,
    ]);




    return res.status(200).json({

      success:true,

      message:
        "Gallery deleted successfully",

    });





  } catch(error) {


    console.error(
      "GALLERY DELETE ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Gallery delete failed",

    });


  }

};
