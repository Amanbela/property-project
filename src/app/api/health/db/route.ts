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

  const uri = process.env.MONGODB_URI || "";
  const uriParts = uri
    ? {
        scheme: uri.split("://")[0] ?? "missing",
        host: (() => {
          try {
            const m = uri.match(/@([^/?#]+)/);
            return m ? m[1] : "parse-error";
          } catch {
            return "parse-error";
          }
        })(),
        user: (() => {
          try {
            const m = uri.match(/:\/\/([^:]+):/);
            return m ? m[1] : "";
          } catch {
            return "parse-error";
          }
        })(),
        database: (() => {
          try {
            const m = uri.match(/\.net\/([^?]+)/);
            return m ? m[1] : "";
          } catch {
            return "parse-error";
          }
        })(),
        hasRetryWrites: /retryWrites=/.test(uri),
        hasW: /w=/.test(uri),
      }
    : null;

  return NextResponse.json({
    configured,
    status,
    ping,
    uri: uriParts,
    env: {
      uriSet: Boolean(uri),
      nextAuthConfigured: Boolean(process.env.NEXTAUTH_SECRET),
      nodeEnv: process.env.NODE_ENV,
    },
    atlasTroubleshooting: {
      step1_checkClusterStatus: {
        action: `Open https://cloud.mongodb.com → Clusters → verify "${uriParts?.host?.split(".")[0] ?? "your-cluster"}" shows a green "ACTIVE" badge`,
        note: "Free tier M0 clusters pause after 60 days of inactivity. Reactivate via Atlas UI.",
      },
      step2_checkNetworkAccess: {
        action: "Atlas → Network Access → IP Access List",
        note: "Your current IP must be whitelisted. For dev only, add 0.0.0.0/0 (any IP). Atlas can take 1-2 minutes to apply changes.",
      },
      step3_checkDatabaseUser: {
        action: "Atlas → Database Access → verify the user exists",
        details: {
          username: uriParts?.user ?? "unknown",
          passwordCorrect: ping.error?.includes("Authentication failed")
            ? "NO — password is wrong or user doesn't exist"
            : "likely correct (no auth error in ping)",
        },
      },
      step4_checkUriFormat: {
        expected: `mongodb+srv://<user>:<password>@<cluster>.<domain>.mongodb.net/<database>?retryWrites=true&w=majority`,
        actual: uriParts,
        commonPasswordIssues: [
          "Password must be URL-encoded if it contains: @ : / ? # [ ]",
          'Example: password "pass@word" → "pass%40word"',
          'Try: echo -n "your-password" | node -e "process.stdin.on(\"data\",d=>console.log(encodeURIComponent(d.toString().trim())))"',
        ],
      },
      step5_testManually: {
        action: "From your terminal, install mongosh and run:",
        command: uri
          ? `mongosh "${uri}" --eval "db.runCommand({ping:1})" 2>&1`
          : "(set MONGODB_URI first)",
        expectedOutput: `{ ok: 1 }`,
      },
      step6_connectionTimeout: {
        note: "Atlas Free Tier can take 10-30 seconds to cold-start after ~10min inactivity.",
        configuredTimeout: "15s server selection + 15s connect = 30s total",
        ifStillFailing:
          "If timeout persists after 30s, the cluster may be paused, your IP may not be whitelisted, or credentials may be wrong.",
      },
    },
  });
}
