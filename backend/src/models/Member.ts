import mongoose, { Document, Schema } from "mongoose";

export interface IMember extends Document {
  name: string;
  designation: string;
  email: string;
  phone: string;
  organization?: string;
  state?: string;
  photo: string;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    organization: { type: String, trim: true },
    state: { type: String, trim: true },
    photo: {
      type: String,
      default: "",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
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

memberSchema.index({ designation: 1, organization: 1, state: 1, status: 1, displayOrder: 1 });

const Member = mongoose.models.Member || mongoose.model<IMember>(
  "Member",
  memberSchema
);

export default Member;
