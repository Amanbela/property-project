import { NextResponse } from "next/server";
import {
  pingDatabase,
  getConnectionStatus,
  isMongoConfigured,
} from "@/infrastructure/db/connection";

export async function GET() {
  const configured = isMongoConfigured();
  const status = getConnectionStatus();
  const ping = await pingDatabase();

  return NextResponse.json({
    configured,
    status,
    ping,
    env: {
      uriSet: Boolean(process.env.MONGODB_URI),
      uriPrefix: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.slice(0, 20) + "..."
        : "not set",
      nextAuthConfigured: Boolean(process.env.NEXTAUTH_SECRET),
      nodeEnv: process.env.NODE_ENV,
    },
    instructions: {
      atlasClusterCheck:
        "Log in to https://cloud.mongodb.com → Clusters → check cluster0 is running (not paused)",
      networkAccessCheck:
        "Atlas → Network Access → ensure your current IP is in the list (or set 0.0.0.0/0 for dev)",
      databaseUserCheck:
        "Atlas → Database Access → verify user amanbela8827_db_user exists and has password correct",
      connectionStringCheck:
        "Verify the cluster name in your URI matches Atlas exactly (cluster0.uwar5gr vs what Atlas shows). Free tier clusters get auto-named.",
      commonIssues: [
        "IP not whitelisted in Atlas Network Access",
        "Cluster paused after 60 days of inactivity (free tier)",
        "Password contains special chars that need URL encoding",
        "Wrong database name in connection string",
      ],
    },
  });
}
