import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import multer from "multer";
import { ErrorRequestHandler } from "express";

import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import activityRoutes from "./routes/activity.routes";
import pressReleaseRoutes from "./routes/pressRelease.routes";
import pressConferenceRoutes from "./routes/pressConference.routes";
import announcementRoutes from "./routes/announcement.routes";
import eventRoutes from "./routes/event.routes";
import galleryRoutes from "./routes/galleryRoutes";
import executiveCommitteeRoutes from "./routes/executiveCommitteeRoutes";
import publicExecutiveRoutes from "./routes/publicExecutive.routes";
import contactMessageRoutes from "./routes/contactMessageRoutes";
import websiteSettingsRoutes from "./routes/websiteSettingsRoutes";
import sponsorRoutes from "./routes/sponsorRoutes";
import advertisementRoutes from "./routes/advertisement.routes";
import bannerRoutes from "./routes/banner.routes";
import latestUpdatesRoutes from "./routes/latestUpdates.routes";
import memberRoutes from "./routes/member.routes";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000").split(",").map((origin) => origin.trim());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/activities", activityRoutes);
app.use("/api/press-releases", pressReleaseRoutes);
app.use("/api/press-conferences", pressConferenceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/executive-committee", executiveCommitteeRoutes);
app.use("/api/executive", publicExecutiveRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/settings", websiteSettingsRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/latest-updates", latestUpdatesRoutes);
app.use("/api/members", memberRoutes);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "Upload exceeds the 10 MB file-size limit." : error.message;
    return res.status(400).json({ success: false, message });
  }
  if (error instanceof Error) {
    if (error.message === "Origin not allowed by CORS") return res.status(403).json({ success: false, message: error.message });
    if (error.message.includes("Only ")) return res.status(400).json({ success: false, message: error.message });
  }
  console.error("Unhandled API error:", error);
  return res.status(500).json({ success: false, message: "Internal server error." });
};

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    message: "Press Club Backend API Running",
  });
});

export default app;
