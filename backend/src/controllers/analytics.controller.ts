import { Request, Response } from "express";
import { createHash, randomUUID } from "crypto";
import AnalyticsEvent from "../models/analyticsEvent.model";
import AnalyticsSession from "../models/analyticsSession.model";
import AnalyticsVisitor from "../models/analyticsVisitor.model";

const RETENTION_DAYS = 400;
const ACTIVE_WINDOW_MS = 90_000;
const MAX_REPORT_DAYS = 366;
const ALLOWED_EVENTS = new Set([
  "page_view",
  "page_duration",
  "button_click",
  "link_click",
  "registration",
  "download",
  "feature",
]);

const hashIdentifier = (value: string) =>
  createHash("sha256")
    .update(`${process.env.JWT_SECRET || "gnpc-analytics"}:${value}`)
    .digest("hex");

const cleanPath = (value: unknown): string => {
  if (typeof value !== "string") return "/";
  const path = value.trim().split(/[?#]/, 1)[0].slice(0, 200);
  if (!path.startsWith("/") || path.startsWith("//") || /[\u0000-\u001f]/.test(path)) return "/";
  if (path === "/admin" || path.startsWith("/admin/")) return "/";
  return path || "/";
};

const validClientId = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length >= 16 &&
  value.length <= 80 &&
  /^[a-zA-Z0-9_-]+$/.test(value);

const isBot = (userAgent: string) =>
  /bot|crawler|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp/i.test(userAgent);

const getDevice = (userAgent: string): "mobile" | "tablet" | "desktop" | "unknown" => {
  if (!userAgent) return "unknown";
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
};

const getBrowser = (ua: string): string => {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua)) return "Opera";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  return ua ? "Other" : "Unknown";
};

const getReferrerSource = (value: unknown, origin: string): string => {
  if (typeof value !== "string" || !value.trim()) return "Direct";
  try {
    const host = new URL(value).hostname.replace(/^www\./, "").slice(0, 120);
    if (!host) return "Direct";
    if (origin && new URL(origin).hostname === new URL(value).hostname) return "Internal";
    return host;
  } catch {
    return "Direct";
  }
};

const getClientContext = (req: Request) => {
  const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);
  return {
    userAgent,
    deviceType: getDevice(userAgent),
    browser: getBrowser(userAgent),
  };
};

const getIdentity = (req: Request) => {
  const visitorId = req.body?.visitorId;
  const sessionId = req.body?.sessionId;
  if (!validClientId(visitorId) || !validClientId(sessionId)) return null;
  return {
    visitorKey: hashIdentifier(visitorId),
    sessionKey: hashIdentifier(sessionId),
  };
};

const retentionDate = (now: Date) => {
  const date = new Date(now);
  date.setDate(date.getDate() + RETENTION_DAYS);
  return date;
};

const upsertSession = async (
  req: Request,
  identity: { visitorKey: string; sessionKey: string },
  path: string,
  now: Date
) => {
  const context = getClientContext(req);
  const referrerSource = getReferrerSource(req.body?.referrer, String(req.headers.origin || ""));
  await Promise.all([
    AnalyticsSession.findOneAndUpdate(
      { sessionKey: identity.sessionKey },
      {
        $set: {
          lastSeenAt: now,
          currentPath: path,
          deviceType: context.deviceType,
          browser: context.browser,
        },
        $setOnInsert: {
          visitorKey: identity.visitorKey,
          firstSeenAt: now,
          entryPath: path,
          referrerSource,
          retentionAt: retentionDate(now),
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    ),
    AnalyticsVisitor.findOneAndUpdate(
      { visitorKey: identity.visitorKey },
      {
        $set: { lastSeenAt: now, retentionAt: retentionDate(now) },
        $setOnInsert: { firstSeenAt: now },
      },
      { upsert: true, setDefaultsOnInsert: true }
    ),
  ]);
  return { ...context, referrerSource };
};

/**
 * Public first-party heartbeat. The browser sends only random opaque IDs and
 * a pathname; IP addresses, query strings, form values and account details
 * are never stored.
 */
export const analyticsHeartbeat = async (req: Request, res: Response) => {
  try {
    const context = getClientContext(req);
    if (isBot(context.userAgent)) return res.status(204).end();

    const identity = getIdentity(req);
    if (!identity) return res.status(400).json({ success: false, message: "Invalid analytics session." });

    const now = new Date();
    await upsertSession(req, identity, cleanPath(req.body?.path), now);
    return res.status(202).json({ success: true });
  } catch (error) {
    console.error("Analytics heartbeat failed:", error);
    return res.status(202).json({ success: false });
  }
};

/** Public event intake with a strict event allow-list and bounded payload. */
export const analyticsEvent = async (req: Request, res: Response) => {
  try {
    const context = getClientContext(req);
    if (isBot(context.userAgent)) return res.status(204).end();

    const identity = getIdentity(req);
    if (!identity) return res.status(400).json({ success: false, message: "Invalid analytics session." });

    const eventType = req.body?.eventType;
    if (typeof eventType !== "string" || !ALLOWED_EVENTS.has(eventType)) {
      return res.status(400).json({ success: false, message: "Unsupported analytics event." });
    }

    const now = new Date();
    const path = cleanPath(req.body?.path);
    const sessionContext = await upsertSession(req, identity, path, now);
    const rawLabel = typeof req.body?.label === "string" ? req.body.label : "";
    const label = rawLabel.replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
    const duration = Number(req.body?.durationSeconds);
    const durationSeconds =
      eventType === "page_duration" && Number.isFinite(duration)
        ? Math.min(1800, Math.max(0, Math.round(duration)))
        : undefined;

    await AnalyticsEvent.create({
      eventId: validClientId(req.body?.eventId) ? req.body.eventId : randomUUID(),
      ...identity,
      eventType,
      path,
      label,
      ...(durationSeconds !== undefined ? { durationSeconds } : {}),
      deviceType: sessionContext.deviceType,
      browser: sessionContext.browser,
      referrerSource: sessionContext.referrerSource,
      createdAt: now,
      retentionAt: retentionDate(now),
    });

    return res.status(202).json({ success: true });
  } catch (error: any) {
    // Retries are idempotent because the client supplies a unique event ID.
    if (error?.code === 11000) return res.status(202).json({ success: true });
    console.error("Analytics event failed:", error);
    return res.status(202).json({ success: false });
  }
};

const parseRange = (req: Request) => {
  const fromValue = typeof req.query.from === "string" ? req.query.from : "";
  const toValue = typeof req.query.to === "string" ? req.query.to : "";
  const endOfToday = new Date();
  endOfToday.setUTCHours(0, 0, 0, 0);
  endOfToday.setUTCDate(endOfToday.getUTCDate() + 1);

  const toDate = toValue ? new Date(`${toValue}T00:00:00.000Z`) : endOfToday;
  const to = toValue ? new Date(toDate.getTime() + 24 * 60 * 60 * 1000) : endOfToday;
  const from = fromValue
    ? new Date(`${fromValue}T00:00:00.000Z`)
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) {
    throw new Error("Choose a valid analytics date range.");
  }
  if ((to.getTime() - from.getTime()) / 86400000 > MAX_REPORT_DAYS) {
    throw new Error("Analytics reports are limited to 366 days per request.");
  }
  return { from, to };
};

const countUniqueVisitors = async (from: Date, to: Date) => {
  const result = await AnalyticsEvent.aggregate([
    { $match: { eventType: "page_view", createdAt: { $gte: from, $lt: to } } },
    { $group: { _id: "$visitorKey" } },
    { $count: "total" },
  ]);
  return result[0]?.total || 0;
};

const percentChange = (current: number, previous: number) => {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

export const getAnalyticsReport = async (req: Request, res: Response) => {
  try {
    const { from, to } = parseRange(req);
    const durationMs = to.getTime() - from.getTime();
    const previousFrom = new Date(from.getTime() - durationMs);
    const pageViewMatch = { eventType: "page_view", createdAt: { $gte: from, $lt: to } };

    const [
      totals,
      trend,
      weeklyTrend,
      monthlyTrend,
      pages,
      sections,
      features,
      durationStats,
      devices,
      browsers,
      sources,
      visitorClassification,
      sessionsCount,
      activeVisitors,
      activeSessions,
      recentEvents,
      previousTotals,
      previousVisitors,
    ] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $group: { _id: null, pageViews: { $sum: 1 }, visitors: { $addToSet: "$visitorKey" } } },
        { $project: { _id: 0, pageViews: 1, uniqueVisitors: { $size: "$visitors" } } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } }, pageViews: { $sum: 1 }, visitors: { $addToSet: "$visitorKey" } } },
        { $project: { date: "$_id", _id: 0, pageViews: 1, uniqueVisitors: { $size: "$visitors" } } },
        { $sort: { date: 1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "week", startOfWeek: "monday", timezone: "Asia/Kolkata" } }, pageViews: { $sum: 1 }, visitors: { $addToSet: "$visitorKey" } } },
        { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$_id", timezone: "Asia/Kolkata" } }, _id: 0, pageViews: 1, uniqueVisitors: { $size: "$visitors" } } },
        { $sort: { date: 1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "month", timezone: "Asia/Kolkata" } }, pageViews: { $sum: 1 }, visitors: { $addToSet: "$visitorKey" } } },
        { $project: { date: { $dateToString: { format: "%Y-%m", date: "$_id", timezone: "Asia/Kolkata" } }, _id: 0, pageViews: 1, uniqueVisitors: { $size: "$visitors" } } },
        { $sort: { date: 1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $group: { _id: "$path", pageViews: { $sum: 1 }, visitors: { $addToSet: "$visitorKey" } } },
        { $project: { path: "$_id", _id: 0, pageViews: 1, uniqueVisitors: { $size: "$visitors" } } },
        { $sort: { pageViews: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: pageViewMatch },
        { $project: { section: { $let: { vars: { parts: { $split: ["$path", "/"] } }, in: { $cond: [{ $eq: [{ $arrayElemAt: ["$$parts", 1] }, ""] }, "Home", { $arrayElemAt: ["$$parts", 1] }] } } } } },
        { $group: { _id: "$section", views: { $sum: 1 } } },
        { $project: { section: "$_id", _id: 0, views: 1 } },
        { $sort: { views: -1 } },
        { $limit: 8 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: from, $lt: to }, eventType: { $in: ["button_click", "link_click", "registration", "download", "feature"] } } },
        { $group: { _id: { type: "$eventType", label: "$label" }, count: { $sum: 1 } } },
        { $project: { type: "$_id.type", label: "$_id.label", _id: 0, count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventType: "page_duration", createdAt: { $gte: from, $lt: to }, durationSeconds: { $gt: 0 } } },
        { $group: { _id: null, totalSeconds: { $sum: "$durationSeconds" }, samples: { $sum: 1 } } },
        { $project: { _id: 0, averageSeconds: { $round: [{ $divide: ["$totalSeconds", "$samples"] }, 1] }, samples: 1 } },
      ]),
      AnalyticsSession.aggregate([
        { $match: { firstSeenAt: { $gte: from, $lt: to } } },
        { $group: { _id: "$deviceType", sessions: { $sum: 1 } } },
        { $project: { name: "$_id", _id: 0, count: "$sessions" } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsSession.aggregate([
        { $match: { firstSeenAt: { $gte: from, $lt: to } } },
        { $group: { _id: "$browser", sessions: { $sum: 1 } } },
        { $project: { name: "$_id", _id: 0, count: "$sessions" } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsSession.aggregate([
        { $match: { firstSeenAt: { $gte: from, $lt: to } } },
        { $group: { _id: "$referrerSource", sessions: { $sum: 1 } } },
        { $project: { name: "$_id", _id: 0, count: "$sessions" } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsVisitor.aggregate([
        { $match: { lastSeenAt: { $gte: from, $lt: to } } },
        { $group: { _id: null, newVisitors: { $sum: { $cond: [{ $gte: ["$firstSeenAt", from] }, 1, 0] } }, returningVisitors: { $sum: { $cond: [{ $lt: ["$firstSeenAt", from] }, 1, 0] } } } },
      ]),
      AnalyticsSession.countDocuments({ firstSeenAt: { $gte: from, $lt: to } }),
      AnalyticsVisitor.countDocuments({ lastSeenAt: { $gte: new Date(Date.now() - ACTIVE_WINDOW_MS) } }),
      AnalyticsSession.find({ lastSeenAt: { $gte: new Date(Date.now() - ACTIVE_WINDOW_MS) } })
        .sort({ lastSeenAt: -1 }).limit(12).select("sessionKey entryPath currentPath firstSeenAt lastSeenAt deviceType referrerSource").lean(),
      AnalyticsEvent.find({ createdAt: { $gte: from, $lt: to } })
        .sort({ createdAt: -1 }).limit(100)
        .select("sessionKey eventType path label createdAt durationSeconds").lean(),
      AnalyticsEvent.countDocuments({ eventType: "page_view", createdAt: { $gte: previousFrom, $lt: from } }),
      countUniqueVisitors(previousFrom, from),
    ]);

    const pageViews = totals[0]?.pageViews || 0;
    const uniqueVisitors = totals[0]?.uniqueVisitors || 0;
    const journeys = activeSessions.map((session: any) => ({
      session: session.sessionKey.slice(0, 10),
      entryPath: session.entryPath,
      currentPath: session.currentPath,
      firstSeenAt: session.firstSeenAt,
      lastSeenAt: session.lastSeenAt,
      deviceType: session.deviceType,
      referrerSource: session.referrerSource,
      steps: recentEvents
        .filter((event: any) => event.sessionKey === session.sessionKey)
        .slice(0, 8)
        .reverse()
        .map((event: any) => ({
          type: event.eventType,
          path: event.path,
          label: event.label,
          at: event.createdAt,
        })),
    }));

    const classification = visitorClassification[0] || { newVisitors: 0, returningVisitors: 0 };
    return res.json({
      success: true,
      data: {
        range: { from: from.toISOString(), to: to.toISOString() },
        summary: {
          uniqueVisitors,
          pageViews,
          sessions: sessionsCount,
          activeVisitors,
          averageTimeSeconds: durationStats[0]?.averageSeconds || 0,
          newVisitors: classification.newVisitors || 0,
          returningVisitors: classification.returningVisitors || 0,
          visitorChange: percentChange(uniqueVisitors, previousVisitors),
          pageViewChange: percentChange(pageViews, previousTotals),
        },
        trend,
        weeklyTrend,
        monthlyTrend,
        pages,
        sections,
        features,
        audience: { devices, browsers, sources },
        live: journeys,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load analytics report.";
    if (message.includes("date range") || message.includes("366 days")) {
      return res.status(400).json({ success: false, message });
    }
    console.error("Analytics report failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load analytics report." });
  }
};
