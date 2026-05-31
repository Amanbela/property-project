import "server-only";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.warn("[db] MONGODB_URI is not set — read paths return empty defaults; writes require a configured database.");
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var __mongooseConnPromise: Promise<typeof mongoose> | null;
}

global.__mongooseConn = global.__mongooseConn ?? null;
global.__mongooseConnPromise = global.__mongooseConnPromise ?? null;

// Allow buffered operations to wait up to 30s for Atlas cold-start.
mongoose.set("bufferTimeoutMS", 30_000);

// Atlas Free Tier cold-start can take 10–30s after idle.
// These timeouts give Atlas enough time to spin up.
const SERVER_SELECTION_TIMEOUT_MS = 15_000;
const CONNECTION_TIMEOUT_MS = 15_000;
const HEARTBEAT_FREQUENCY_MS = 5_000;

// Retry with backoff — first retry waits 5s (for cold-start), then shorter.
const RECONNECT_INTERVALS = [5_000, 3_000, 3_000, 5_000, 10_000];

/**
 * Appends required query params to the Atlas SRV URI if missing.
 * Uses simple string ops instead of `new URL()` to avoid issues with
 * special characters in the password or non-standard `mongodb+srv://` scheme.
 */
function ensureUriParams(uri: string): string {
  const hasRetryWrites = /[?&]retryWrites=/.test(uri);
  const hasW = /[?&]w=/.test(uri);
  if (hasRetryWrites && hasW) return uri;

  const sep = uri.includes("?") ? "&" : "?";
  const parts = [uri];
  if (!hasRetryWrites) parts.push("retryWrites=true");
  if (!hasW) parts.push("w=majority");
  return parts.join(sep);
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

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose;
  }

  if (global.__mongooseConnPromise) {
    return global.__mongooseConnPromise;
  }

  const uri = ensureUriParams(MONGO_URI);

  removeListeners();
  attachListeners();

  const connPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    connectTimeoutMS: CONNECTION_TIMEOUT_MS,
    heartbeatFrequencyMS: HEARTBEAT_FREQUENCY_MS,
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
    const message = (err as Error).message;
    console.error(`[db] Connection failed: ${message}`);
    throw err;
  }
}

export async function connectForWrites(): Promise<void> {
  assertMongoConfigured();
  const err = await connectDBWithRetry();
  if (err) throw err;
}

export async function connectDBWithRetry(maxRetries = 4): Promise<Error | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDB();
      return null;
    } catch (err) {
      const message = (err as Error).message;
      console.warn(`[db] Connection attempt ${attempt}/${maxRetries} failed: ${message}`);
      if (attempt < maxRetries) {
        const delay = RECONNECT_INTERVALS[Math.min(attempt - 1, RECONNECT_INTERVALS.length - 1)];
        console.log(`[db] Retrying in ${delay}ms...`);
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

export async function pingDatabase(): Promise<{
  ok: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const conn = await connectDB();
    if (!conn) {
      return { ok: false, latencyMs: Date.now() - start, error: "MONGODB_URI not set" };
    }
    const db = mongoose.connection.db;
    if (!db) {
      return { ok: false, latencyMs: Date.now() - start, error: "No database instance (db is null)" };
    }
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
