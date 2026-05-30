import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { SeoPageModel } from "@/infrastructure/seo/models/SeoPage";

export type SeoPageDoc = {
  id: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  keyword: string;
  h1: string;
  intro: string;
  sections: { heading: string; content: string }[];
  faqs: { q: string; a: string }[];
  published: boolean;
  articleSchemaJson?: string;
  faqSchemaJson?: string;
  createdAt?: string;
  updatedAt?: string;
};

function toPublic(doc: Record<string, unknown> | null): SeoPageDoc | null {
  if (!doc) return null;
  return {
    id: String(doc._id),
    slug: String(doc.slug),
    seoTitle: String(doc.seoTitle),
    metaDescription: String(doc.metaDescription),
    keyword: String(doc.keyword ?? ""),
    h1: String(doc.h1),
    intro: String(doc.intro ?? ""),
    sections: (doc.sections as SeoPageDoc["sections"]) ?? [],
    faqs: (doc.faqs as SeoPageDoc["faqs"]) ?? [],
    published: Boolean(doc.published ?? true),
    articleSchemaJson: doc.articleSchemaJson ? String(doc.articleSchemaJson) : undefined,
    faqSchemaJson: doc.faqSchemaJson ? String(doc.faqSchemaJson) : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as Date).toISOString() : undefined
  };
}

export async function getPublishedSeoPages() {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await SeoPageModel.find({ published: true }).sort({ slug: 1 }).lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!);
}

export async function getSeoPageBySlug(slug: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await SeoPageModel.findOne({ slug, published: true }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function getSeoPageBySlugAdmin(slug: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await SeoPageModel.findOne({ slug }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function listSeoPagesAdmin(params: { page?: number; pageSize?: number; search?: string }) {
  if (!isMongoConfigured()) {
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 30));
    return { total: 0, page: Math.max(1, params.page ?? 1), pageSize, items: [] };
  }
  await connectDB();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 30));
  const filter: Record<string, unknown> = {};
  if (params.search) {
    filter.$or = [
      { slug: new RegExp(params.search, "i") },
      { h1: new RegExp(params.search, "i") },
      { seoTitle: new RegExp(params.search, "i") }
    ];
  }
  const [total, rows] = await Promise.all([
    SeoPageModel.countDocuments(filter),
    SeoPageModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()
  ]);
  return { total, page, pageSize, items: rows.map((r) => toPublic(r as Record<string, unknown>)!) };
}

export async function getSeoPageById(id: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await SeoPageModel.findById(id).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function countSeoPages() {
  if (!isMongoConfigured()) return 0;
  await connectDB();
  return SeoPageModel.countDocuments();
}

export async function getPublishedSeoSlugsForStatic(): Promise<{ slug: string }[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await SeoPageModel.find({ published: true }).select("slug").lean();
  return rows.map((r) => ({ slug: String((r as { slug: string }).slug) }));
}
