import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    image: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ order: 1 });

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
