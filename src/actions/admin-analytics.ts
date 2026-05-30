"use server";

import { getAdminSession } from "@/lib/auth-guard";
import {
  getAnalyticsReport,
  getFunnelData,
} from "@/features/analytics/services/analytics-service";

export async function fetchAnalyticsReport() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  try {
    const report = await getAnalyticsReport();
    return { ok: true as const, data: report };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function fetchFunnelData() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  try {
    const data = await getFunnelData();
    return { ok: true as const, data };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}
