import { connectDB, connectForWrites, isMongoConfigured } from "@/infrastructure/db/connection";
import { SiteSettingsModel } from "@/infrastructure/db/models/SiteSettings";

export type SiteSettingsDoc = {
  id: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  robotsTxtOverride?: string;
  canonicalBaseUrl?: string;
  recommendationWeightsJson?: string;
};

const OFFLINE_SITE_SETTINGS: SiteSettingsDoc = {
  id: "offline",
  defaultSeoTitle: undefined,
  defaultSeoDescription: undefined,
  robotsTxtOverride: undefined,
  canonicalBaseUrl: undefined,
  recommendationWeightsJson: undefined
};

function toDoc(raw: Record<string, unknown> | null): SiteSettingsDoc | null {
  if (!raw) return null;
  return {
    id: String(raw._id),
    defaultSeoTitle: raw.defaultSeoTitle ? String(raw.defaultSeoTitle) : undefined,
    defaultSeoDescription: raw.defaultSeoDescription ? String(raw.defaultSeoDescription) : undefined,
    robotsTxtOverride: raw.robotsTxtOverride ? String(raw.robotsTxtOverride) : undefined,
    canonicalBaseUrl: raw.canonicalBaseUrl ? String(raw.canonicalBaseUrl) : undefined,
    recommendationWeightsJson: raw.recommendationWeightsJson ? String(raw.recommendationWeightsJson) : undefined
  };
}

export async function getSiteSettings(): Promise<SiteSettingsDoc> {
  if (!isMongoConfigured()) return OFFLINE_SITE_SETTINGS;
  await connectDB();
  let doc = await SiteSettingsModel.findOne({ singletonKey: "global" }).lean();
  if (!doc) {
    await SiteSettingsModel.create({ singletonKey: "global" });
    doc = await SiteSettingsModel.findOne({ singletonKey: "global" }).lean();
  }
  return toDoc(doc as Record<string, unknown>)!;
}

export async function upsertSiteSettings(data: Partial<Omit<SiteSettingsDoc, "id">>) {
  await connectForWrites();
  await SiteSettingsModel.findOneAndUpdate(
    { singletonKey: "global" },
    { $set: data },
    { upsert: true, new: true }
  ).exec();
}
