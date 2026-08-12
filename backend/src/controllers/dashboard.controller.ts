const getTrafficCollections = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB connection is not ready"
    );
  }

  const sessions =
    db.collection<any>("traffic_sessions");

  const stats =
    db.collection<any>("traffic_stats");

  return {
    sessions,
    stats,
  };
};
