const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB connection is not ready"
    );
  }

  const sessions =
    db.collection<{
      sessionId: string;
      createdAt: Date;
      lastSeen: Date;
      page: string;
    }>("traffic_sessions");

  const stats =
    db.collection<{
      _id: string;
      totalVisits?: number;
      peakOnline?: number;
      peakAt?: Date;
      updatedAt?: Date;
    }>("traffic_stats");

  return {
    sessions,
    stats,
  };
};
