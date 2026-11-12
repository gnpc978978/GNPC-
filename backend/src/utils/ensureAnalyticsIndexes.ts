import AnalyticsEvent from "../models/analyticsEvent.model";
import AnalyticsSession from "../models/analyticsSession.model";
import AnalyticsVisitor from "../models/analyticsVisitor.model";

/**
 * Explicitly create analytics indexes at startup. This ensures unique session
 * keys and TTL retention are active even when Mongoose autoIndex is disabled
 * in a production deployment.
 */
export const ensureAnalyticsIndexes = async () => {
  await Promise.all([
    AnalyticsEvent.createIndexes(),
    AnalyticsSession.createIndexes(),
    AnalyticsVisitor.createIndexes(),
  ]);
};
