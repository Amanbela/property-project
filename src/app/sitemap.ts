import { MetadataRoute } from "next";
import { getPublishedAreas } from "@/features/colony-intelligence/services/area-service";
import { getPublishedBlogs } from "@/infrastructure/seo/services/blog-service";
import { getPublishedSeoPages } from "@/infrastructure/seo/services/seo-page-service";
import { getActiveBudgetRanges } from "@/features/budget/services/budget-service";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/areas", "/blog", "/guides", "/admin/login", "/budget"];
  let areaRoutes: string[] = [];
  let blogRoutes: string[] = [];
  let guideRoutes: string[] = [];
  let budgetRoutes: string[] = [];
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
  return [...staticRoutes, ...areaRoutes, ...blogRoutes, ...guideRoutes, ...budgetRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
