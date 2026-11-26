import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables.");
}

if (!dbName) {
  throw new Error("MONGODB_DB is missing from environment variables.");
}

// Create a single MongoDB client
const client = new MongoClient(uri);

let clientPromise;

export async function connectDB() {
  if (!clientPromise) {
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  await clientPromise;

  return client.db(dbName);
}

// Export client for future Better Auth setup
export { client };