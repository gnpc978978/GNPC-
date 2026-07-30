import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";


// CREATE CONTACT MESSAGE

export const createContactMessage = async (
  req: Request,
  res: Response
) => {

  try {

    const contactMessage =
      await ContactMessage.create(req.body);


    return res.status(201).json({

      success: true,

      message:
        "Message sent successfully",

      data: contactMessage,

    });


  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        "Failed to send message",

    });

  }

};




// GET ALL CONTACT MESSAGES

export const getContactMessages = async (
  req: Request,
  res: Response
) => {

  try {

    const messages =
      await ContactMessage.find()
      .sort({
        createdAt: -1,
      });


    return res.status(200).json({

      success: true,

      data: messages,

    });


  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch messages",

    });

  }

};




// GET SINGLE MESSAGE

export const getContactMessageById = async (
  req: Request,
  res: Response
) => {

  try {

    const message =
      await ContactMessage.findById(
        req.params.id
      );


    if(!message){

      return res.status(404).json({

        success:false,

        message:
          "Message not found",

      });

    }


    return res.status(200).json({

      success:true,

      data:message,

    });


  } catch(error){

    return res.status(500).json({

      success:false,

      message:
        "Failed to fetch message",

    });

  }

};




// UPDATE STATUS

export const updateContactMessageStatus =
async (
  req: Request,
  res: Response
) => {

  try {


    const message =
      await ContactMessage.findByIdAndUpdate(

        req.params.id,

        {
          status:
            req.body.status,
        },

        {
          returnDocument: "after",
        }

      );



    if(!message){

      return res.status(404).json({

        success:false,

        message:
          "Message not found",

      });

    }



    return res.status(200).json({

      success:true,

      data:message,

    });



  } catch(error){

    return res.status(500).json({

      success:false,

      message:
        "Failed to update status",

    });

  }

};





// DELETE MESSAGE

export const deleteContactMessage =
async (
  req: Request,
  res: Response
) => {

  try {


    const message =
      await ContactMessage.findByIdAndDelete(
        req.params.id
      );



    if(!message){

      return res.status(404).json({

        success:false,

        message:
          "Message not found",

      });

    }



    return res.status(200).json({

      success:true,

      message:
        "Message deleted successfully",

    });



  } catch(error){

    return res.status(500).json({

      success:false,

      message:
        "Failed to delete message",

    });

  }

};
