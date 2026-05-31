import bcrypt from "bcryptjs";
import { connectForWrites } from "@/infrastructure/db/connection";
import { areas as seedAreas } from "@/data/areas";
import { blogs as seedBlogs } from "@/data/blogs";
import { seoGuides } from "@/data/seo-pages";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { BlogModel } from "@/infrastructure/seo/models/Blog";
import { SeoPageModel } from "@/infrastructure/seo/models/SeoPage";
import { AdminUserModel } from "@/infrastructure/db/models/AdminUser";
import { SiteSettingsModel } from "@/infrastructure/db/models/SiteSettings";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";
import { colonies as seedColonies } from "@/data/colonies";

async function run() {
  await connectForWrites();

  await AreaModel.deleteMany({});
  await ColonyModel.deleteMany({});
  await BlogModel.deleteMany({});
  await SeoPageModel.deleteMany({});

  const areas = seedAreas.map((a) => {
    const { createdAt, ...rest } = a;
    void createdAt;
    return {
      ...rest,
      published: true,
      viewCount: 0,
      seoTitle: `${a.name} — Property insights Indore`,
      seoDescription: a.description
    };
  });

  const blogs = seedBlogs.map((b) => {
    const { createdAt, ...rest } = b;
    void createdAt;
    return {
      ...rest,
      status: "published" as const,
      schemaType: "Article",
      relatedSlugs: [] as string[]
    };
  });

  const seoPages = seoGuides.map((g) => ({
    slug: g.slug,
    seoTitle: g.seoTitle,
    metaDescription: g.metaDescription,
    keyword: g.keyword,
    h1: g.h1,
    intro: g.intro,
    sections: g.sections,
    faqs: g.faqs,
    published: true
  }));

  await AreaModel.insertMany(areas);
  await ColonyModel.insertMany(seedColonies);
  await BlogModel.insertMany(blogs);
  await SeoPageModel.insertMany(seoPages);

  const email = ( "admin@example.com").toLowerCase();
  const password = "changeme123";
  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUserModel.deleteMany({ email });
  await AdminUserModel.create({ email, passwordHash, role: "admin" });

  await SiteSettingsModel.findOneAndUpdate(
    { singletonKey: "global" },
    {
      $setOnInsert: { singletonKey: "global" },
      $set: {
        defaultSeoTitle: "Indore Property Budget Finder",
        defaultSeoDescription: "Property intelligence and area recommendations for Indore."
      }
    },
    { upsert: true }
  );

  console.log("Seed complete. Admin:", email, "| Password:", password === "changeme123" ? "(default changeme123 — change immediately)" : "(from ADMIN_PASSWORD)");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
