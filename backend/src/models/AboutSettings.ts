import mongoose, { Document, Schema } from "mongoose";

export interface IAboutSettings extends Document {
  image?: string;
  heading: string;
  description: string;
  features: string[];
  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSettingsSchema = new Schema<IAboutSettings>({
  image: { type: String, trim: true },
  heading: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
  features: { type: [String], default: [] },
  presidentName: { type: String, trim: true, default: "" },
  presidentDesignation: { type: String, trim: true, default: "" },
  presidentMessage: { type: String, trim: true, default: "" },
  presidentPhoto: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.AboutSettings || mongoose.model<IAboutSettings>("AboutSettings", AboutSettingsSchema);
