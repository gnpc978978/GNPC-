import mongoose, { Schema } from "mongoose";

const analyticsSessionSchema = new Schema(
  {
    sessionKey: { type: String, required: true, unique: true },
    visitorKey: { type: String, required: true, index: true },
    firstSeenAt: { type: Date, required: true, index: true },
    lastSeenAt: { type: Date, required: true, index: true },
    entryPath: { type: String, required: true, maxlength: 200 },
    currentPath: { type: String, required: true, maxlength: 200 },
    referrerSource: { type: String, default: "Direct", maxlength: 120 },
    deviceType: { type: String, enum: ["mobile", "tablet", "desktop", "unknown"], default: "unknown" },
    browser: { type: String, default: "Other", maxlength: 40 },
    retentionAt: { type: Date, required: true },
  },
  { versionKey: false }
);

analyticsSessionSchema.index({ retentionAt: 1 }, { expireAfterSeconds: 0 });
analyticsSessionSchema.index({ lastSeenAt: -1 });
analyticsSessionSchema.index({ firstSeenAt: -1 });
analyticsSessionSchema.index({ visitorKey: 1, firstSeenAt: 1 });

export default mongoose.models.AnalyticsSession ||
  mongoose.model("AnalyticsSession", analyticsSessionSchema);
