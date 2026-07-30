import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  title: string;
  coverImage: string;
  images: string[];
  category: string;
  description: string;
  status: "active" | "inactive";
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGallery>("Gallery", GallerySchema);