import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.warn("MONGODB_URI is not set. Read paths return empty defaults; writes require a configured database.");
}

let cached = (global as typeof global & { mongooseConn?: typeof mongoose | null }).mongooseConn ?? null;

/** True when MongoDB can be used (env present). */
export function isMongoConfigured(): boolean {
  return Boolean(MONGO_URI);
}

/** Connect once; no-op when URI is missing (callers must guard reads/writes). */
export async function connectDB() {
  if (!MONGO_URI) return;
  if (cached) return;
  cached = await mongoose.connect(MONGO_URI);
  (global as typeof global & { mongooseConn?: typeof mongoose }).mongooseConn = cached;
}

/** Use before mutations or auth that must hit the database. */
export function assertMongoConfigured(): void {
  if (!MONGO_URI) throw new Error("Missing MONGODB_URI");
}

/** Connect for write paths; throws if URI is not set. */
export async function connectForWrites(): Promise<void> {
  assertMongoConfigured();
  await connectDB();
}
