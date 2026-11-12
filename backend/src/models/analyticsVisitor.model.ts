import mongoose, { Schema } from "mongoose";

const analyticsVisitorSchema = new Schema(
  {
    visitorKey: { type: String, required: true, unique: true },
    firstSeenAt: { type: Date, required: true, index: true },
    lastSeenAt: { type: Date, required: true },
    retentionAt: { type: Date, required: true },
  },
  { versionKey: false }
);

analyticsVisitorSchema.index({ retentionAt: 1 }, { expireAfterSeconds: 0 });
analyticsVisitorSchema.index({ lastSeenAt: -1 });

export default mongoose.models.AnalyticsVisitor ||
  mongoose.model("AnalyticsVisitor", analyticsVisitorSchema);
