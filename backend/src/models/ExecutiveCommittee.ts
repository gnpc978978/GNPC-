import mongoose, { Document, Schema } from "mongoose";

export interface IExecutiveCommittee extends Document {
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

const executiveCommitteeSchema = new Schema<IExecutiveCommittee>(
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

executiveCommitteeSchema.index({ designation: 1, organization: 1, state: 1, status: 1, displayOrder: 1 });

const ExecutiveCommittee = mongoose.models.ExecutiveCommittee || mongoose.model<IExecutiveCommittee>(
  "ExecutiveCommittee",
  executiveCommitteeSchema
);

export default ExecutiveCommittee;
