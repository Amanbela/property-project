import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const siteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "global" },
    defaultSeoTitle: String,
    defaultSeoDescription: String,
    robotsTxtOverride: String,
    canonicalBaseUrl: String,
    /** Optional JSON string of purpose → weight map for recommendation engine */
    recommendationWeightsJson: String
  },
  { timestamps: true }
);

export const SiteSettingsModel = models.SiteSettings || model("SiteSettings", siteSettingsSchema);
