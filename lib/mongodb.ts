import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/creaive";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Global is used here to maintain a cached client across hot reloads in dev.
 * This prevents connections from growing during API Route usage.
 */
interface MongoGlobal {
  _mongoClientPromise?: Promise<MongoClient>;
}

const g = globalThis as unknown as MongoGlobal;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!g._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    g._mongoClientPromise = client.connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(); // uses the DB name from the URI
}
