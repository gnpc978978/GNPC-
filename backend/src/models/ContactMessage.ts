import mongoose, { Schema, Document } from "mongoose";


export interface IContactMessage extends Document {

  name: string;

  email: string;

  phone?: string;

  subject: string;

  message: string;

  status:
    | "UNREAD"
    | "READ"
    | "REPLIED";

  createdAt: Date;

  updatedAt: Date;

}



const ContactMessageSchema =
  new Schema<IContactMessage>(
    {

      name: {
        type: String,
        required: true,
        trim: true,
      },


      email: {
        type: String,
        required: true,
        trim: true,
      },


      phone: {
        type: String,
        trim: true,
      },


      subject: {
        type: String,
        required: true,
        trim: true,
      },


      message: {
        type: String,
        required: true,
        trim: true,
      },


      status: {
        type: String,
        enum: [
          "UNREAD",
          "READ",
          "REPLIED",
        ],
        default: "UNREAD",
      },


    },
    {
      timestamps: true,
    }
  );



const ContactMessage =
  mongoose.model<IContactMessage>(
    "ContactMessage",
    ContactMessageSchema
  );


export default ContactMessage;