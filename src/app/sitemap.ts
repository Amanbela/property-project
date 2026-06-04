import { MetadataRoute } from "next";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { getPublishedAreas } from "@/features/colony-intelligence/services/area-service";
import { getPublishedBlogs } from "@/infrastructure/seo/services/blog-service";
import { getPublishedSeoPages } from "@/infrastructure/seo/services/seo-page-service";
import { getActiveBudgetRanges } from "@/features/budget/services/budget-service";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/areas", "/areas/compare", "/blog", "/guides", "/admin/login", "/budget"];
  let areaRoutes: string[] = [];
  let blogRoutes: string[] = [];
  let guideRoutes: string[] = [];
  let budgetRoutes: string[] = [];
  let comparisonRoutes: string[] = [];
  try {
    const [areas, blogs, guides, budgetRanges] = await Promise.all([
      getPublishedAreas(500),
      getPublishedBlogs(500),
      getPublishedSeoPages(),
      getActiveBudgetRanges(),
    ]);
    areaRoutes = areas.map((a) => `/areas/${a.slug}`);
    blogRoutes = blogs.map((b) => `/blog/${b.slug}`);
    guideRoutes = guides.map((g) => `/guides/${g.slug}`);
    budgetRoutes = budgetRanges.map((r) => `/budget/${r.slug}`);
  } catch {
    /* build without DB */
  }
  try {
    if (isMongoConfigured()) {
      await connectDB();
      const slugs = await AreaComparisonModel.find({ isActive: true }).select("slug").lean().exec();
      comparisonRoutes = slugs.map((s) => `/areas/compare/${s.slug}`);
    }
  } catch {
    /* build without comparisons */
  }
  return [...staticRoutes, ...areaRoutes, ...comparisonRoutes, ...blogRoutes, ...guideRoutes, ...budgetRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
