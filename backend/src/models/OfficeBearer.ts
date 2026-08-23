import mongoose, { Document, Schema } from "mongoose";

export interface IOfficeBearer extends Document {
  fullName: string;
  photo: string;
  email?: string;
  phone?: string;
  designation?: string;
  organization?: string;
  state?: string;
  district?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const OfficeBearerSchema = new Schema<IOfficeBearer>({
  fullName: { type: String, required: true, trim: true },
  photo: { type: String, required: true, trim: true, default: "/images/members/default.png" },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  designation: { type: String, trim: true },
  organization: { type: String, trim: true },
  state: { type: String, trim: true },
  district: { type: String, trim: true },
  displayOrder: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

OfficeBearerSchema.index({ fullName: "text", email: "text", phone: "text", designation: "text", organization: "text" });
OfficeBearerSchema.index({ displayOrder: 1, createdAt: 1 });

export default mongoose.models.OfficeBearer || mongoose.model<IOfficeBearer>("OfficeBearer", OfficeBearerSchema);
