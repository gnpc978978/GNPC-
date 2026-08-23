import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const collectionExists = async (name: string) => {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection is not ready.");
  return Boolean(await db.listCollections({ name }, { nameOnly: true }).next());
};

const renameCollectionSafely = async (from: string, to: string) => {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection is not ready.");

  const [sourceExists, targetExists] = await Promise.all([
    collectionExists(from),
    collectionExists(to),
  ]);

  if (!sourceExists) return;
  if (targetExists) {
    throw new Error(`Both ${from} and ${to} exist. Resolve the duplicate collections before rerunning this migration.`);
  }

  const sourceCount = await db.collection(from).countDocuments();
  await db.renameCollection(from, to, { dropTarget: false });
  const targetCount = await db.collection(to).countDocuments();
  if (sourceCount !== targetCount) {
    throw new Error(`Document-count verification failed after renaming ${from} to ${to}.`);
  }

  console.log(`Renamed ${from} to ${to} (${targetCount} documents; indexes preserved by MongoDB rename).`);
};

const migrateSettingsKeys = async () => {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection is not ready.");
  if (!(await collectionExists("website_settings"))) return;

  const settings = db.collection("website_settings");
  const result = await settings.updateMany(
    {
      $or: [
        { "home.executiveCommittee": { $exists: true }, "home.members": { $exists: false } },
        { "home.sections.executiveCommittee": { $exists: true }, "home.sections.members": { $exists: false } },
        { "pageSettings.executiveCommittee": { $exists: true }, "pageSettings.members": { $exists: false } },
      ],
    },
    {
      $rename: {
        "home.executiveCommittee": "home.members",
        "home.sections.executiveCommittee": "home.sections.members",
        "pageSettings.executiveCommittee": "pageSettings.members",
      },
    },
  );
  console.log(`Updated ${result.modifiedCount} website settings document(s).`);
};

const migrate = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not configured.");

  await mongoose.connect(uri);
  try {
    // The old `members` collection contains Office Bearers. Move it first so
    // the Members collection can receive the former Executive Committee data.
    const executiveCollectionExists = await collectionExists("executivecommittees");
    if (executiveCollectionExists) {
      await renameCollectionSafely("members", "officebearers");
      await renameCollectionSafely("executivecommittees", "members");
    } else if (await collectionExists("members")) {
      console.log("Collection migration already completed; skipping collection renames.");
    } else {
      console.log("No legacy Executive Committee collection found; skipping collection renames.");
    }
    await migrateSettingsKeys();
    console.log("Executive Committee → Members migration completed.");
  } finally {
    await mongoose.disconnect();
  }
};

void migrate().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
