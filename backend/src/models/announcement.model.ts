import { Schema, model, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  slug?: string;
  content: string;
  image?: string;
  category: string;
  status: "Draft" | "Published";
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema
);

export default Announcement;
