"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth-guard";
import { upsertSiteSettings } from "@/infrastructure/db/services/site-settings-service";

const settingsSchema = z.object({
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  robotsTxtOverride: z.string().optional(),
  canonicalBaseUrl: z.string().url().optional().or(z.literal("")),
  recommendationWeightsJson: z.string().optional()
});

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

export async function updateSiteSettings(formData: FormData): Promise<void> {
  if (!(await assertAdmin())) return;
  const raw = Object.fromEntries(formData.entries());
  const weights = String(raw.recommendationWeightsJson || "").trim();
  if (weights) {
    try {
      JSON.parse(weights);
    } catch {
      return;
    }
  }
  const parsed = settingsSchema.safeParse({
    defaultSeoTitle: raw.defaultSeoTitle || "",
    defaultSeoDescription: raw.defaultSeoDescription || "",
    robotsTxtOverride: raw.robotsTxtOverride || "",
    canonicalBaseUrl: raw.canonicalBaseUrl || "",
    recommendationWeightsJson: weights || undefined
  });
  if (!parsed.success) return;
  await upsertSiteSettings({
    defaultSeoTitle: parsed.data.defaultSeoTitle || undefined,
    defaultSeoDescription: parsed.data.defaultSeoDescription || undefined,
    robotsTxtOverride: parsed.data.robotsTxtOverride || undefined,
    canonicalBaseUrl: parsed.data.canonicalBaseUrl || undefined,
    recommendationWeightsJson: parsed.data.recommendationWeightsJson || undefined
  });
  revalidatePath("/admin/settings");
  revalidatePath("/robots.txt");
}

export async function regenerateSitemapNote(): Promise<void> {
  if (!(await assertAdmin())) return;
  revalidatePath("/sitemap.xml");
}
