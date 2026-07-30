import mongoose, { Schema } from "mongoose";

const advertisementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    sponsor: { type: String, required: true, trim: true },
    banner: { type: String, required: true },
    url: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Advertisement || mongoose.model("Advertisement", advertisementSchema);
