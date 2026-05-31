import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.warn("MONGODB_URI is not set. Read paths return empty defaults; writes require a configured database.");
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var __mongooseConnPromise: Promise<typeof mongoose> | null;
}

global.__mongooseConn = global.__mongooseConn ?? null;
global.__mongooseConnPromise = global.__mongooseConnPromise ?? null;

const CONNECTION_TIMEOUT_MS = 5_000;
const SERVER_SELECTION_TIMEOUT_MS = 5_000;

const RECONNECT_INTERVALS = [1_000, 2_000, 4_000, 8_000, 15_000];

function constructUri(): string {
  if (!MONGO_URI) throw new Error("MONGODB_URI is not set");
  const uri = new URL(MONGO_URI);
  if (!uri.searchParams.has("retryWrites")) {
    uri.searchParams.set("retryWrites", "true");
  }
  if (!uri.searchParams.has("w")) {
    uri.searchParams.set("w", "majority");
  }
  return uri.toString();
}

function onConnected() {
  console.log(`[db] MongoDB connected — ${mongoose.connection.host}/${mongoose.connection.name}`);
}

function onError(err: Error) {
  console.error(`[db] MongoDB connection error:`, err.message);
}

function onDisconnected() {
  console.warn(`[db] MongoDB disconnected`);
}

function onReconnected() {
  console.log(`[db] MongoDB reconnected`);
}

function attachListeners() {
  mongoose.connection.on("connected", onConnected);
  mongoose.connection.on("error", onError);
  mongoose.connection.on("disconnected", onDisconnected);
  mongoose.connection.on("reconnected", onReconnected);
}

function removeListeners() {
  mongoose.connection.off("connected", onConnected);
  mongoose.connection.off("error", onError);
  mongoose.connection.off("disconnected", onDisconnected);
  mongoose.connection.off("reconnected", onReconnected);
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGO_URI) return null;

  const readyState = mongoose.connection.readyState;
  if (readyState === 1 || readyState === 2) {
    return mongoose;
  }

  if (global.__mongooseConnPromise) {
    return global.__mongooseConnPromise;
  }

  const uri = constructUri();

  removeListeners();
  attachListeners();

  const connPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    connectTimeoutMS: CONNECTION_TIMEOUT_MS,
    bufferCommands: false,
    heartbeatFrequencyMS: 10_000,
  });

  global.__mongooseConnPromise = connPromise;

  try {
    const conn = await connPromise;
    global.__mongooseConn = conn;
    return conn;
  } catch (err) {
    global.__mongooseConn = null;
    global.__mongooseConnPromise = null;
    removeListeners();
    throw err;
  }
}

export async function connectForWrites(): Promise<void> {
  assertMongoConfigured();
  const err = await connectDBWithRetry();
  if (err) throw err;
}

export async function connectDBWithRetry(maxRetries = 3): Promise<Error | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDB();
      return null;
    } catch (err) {
      console.warn(`[db] Connection attempt ${attempt}/${maxRetries} failed:`, (err as Error).message);
      if (attempt < maxRetries) {
        const delay = RECONNECT_INTERVALS[Math.min(attempt - 1, RECONNECT_INTERVALS.length - 1)];
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        return err as Error;
      }
    }
  }
  return new Error("Connection failed after retries");
}

export function isMongoConfigured(): boolean {
  return Boolean(MONGO_URI);
}

export function assertMongoConfigured(): void {
  if (!MONGO_URI) throw new Error("Missing MONGODB_URI");
}

export async function pingDatabase(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const conn = await connectDB();
    if (!conn) return { ok: false, latencyMs: Date.now() - start, error: "MONGODB_URI not set" };
    const db = mongoose.connection.db;
    if (!db) return { ok: false, latencyMs: Date.now() - start, error: "No database instance" };
    await db.admin().ping();
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start, error: (err as Error).message };
  }
}

export function getConnectionStatus(): {
  readyState: number;
  readyStateLabel: string;
  host?: string;
  name?: string;
} {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return {
    readyState: mongoose.connection.readyState,
    readyStateLabel: states[mongoose.connection.readyState] ?? "unknown",
    host: mongoose.connection.host || undefined,
    name: mongoose.connection.name || undefined,
  };
}
