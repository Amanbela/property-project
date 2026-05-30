import { MetadataRoute } from "next";
import { getSiteSettings } from "@/infrastructure/db/services/site-settings-service";
import { siteConfig } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let rules: MetadataRoute.Robots["rules"] = [{ userAgent: "*", allow: "/" }];
  try {
    const settings = await getSiteSettings();
    if (settings.robotsTxtOverride?.trim()) {
      const lines = settings.robotsTxtOverride.split("\n").map((l) => l.trim());
      const disallow = lines.filter((l) => l.toLowerCase().startsWith("disallow:")).map((l) => l.split(":")[1]?.trim() || "/");
      if (disallow.length) {
        rules = [{ userAgent: "*", disallow }];
      }
    }
  } catch {
    /* default */
  }
  return {
    rules,
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
