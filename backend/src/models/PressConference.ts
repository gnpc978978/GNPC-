import mongoose, { Document, Schema } from "mongoose";

export interface IPressConference extends Document {
  title: string;
  venue: string;
  date: Date;
  description: string;
  content: string;
  featuredImage?: string;
  pdfFile?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pressConferenceSchema = new Schema<IPressConference>(
  {
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    pdfFile: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.PressConference ||
  mongoose.model<IPressConference>("PressConference", pressConferenceSchema);
