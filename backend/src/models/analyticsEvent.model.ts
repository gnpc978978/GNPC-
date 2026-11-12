import mongoose, { Schema } from "mongoose";

const analyticsEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, maxlength: 80 },
    sessionKey: { type: String, required: true, index: true },
    visitorKey: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ["page_view", "page_duration", "button_click", "link_click", "registration", "download", "feature"],
      required: true,
    },
    path: { type: String, required: true, maxlength: 200 },
    label: { type: String, default: "", maxlength: 80 },
    durationSeconds: { type: Number, min: 0, max: 1800 },
    deviceType: { type: String, enum: ["mobile", "tablet", "desktop", "unknown"], default: "unknown" },
    browser: { type: String, default: "Other", maxlength: 40 },
    referrerSource: { type: String, default: "Direct", maxlength: 120 },
    createdAt: { type: Date, required: true, index: true },
    retentionAt: { type: Date, required: true },
  },
  { versionKey: false }
);

analyticsEventSchema.index({ retentionAt: 1 }, { expireAfterSeconds: 0 });
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ path: 1, createdAt: -1 });
analyticsEventSchema.index({ sessionKey: 1, createdAt: 1 });
analyticsEventSchema.index({ visitorKey: 1, createdAt: 1 });

export default mongoose.models.AnalyticsEvent ||
  mongoose.model("AnalyticsEvent", analyticsEventSchema);
