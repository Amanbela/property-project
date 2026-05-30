import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { BlogModel } from "@/infrastructure/seo/models/Blog";

export type BlogDoc = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  schemaType: string;
  status: "draft" | "published";
  relatedSlugs: string[];
  faqs: { question: string; answer: string }[];
  createdAt?: string;
  updatedAt?: string;
};

function extractImageUrl(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const v = val as Record<string, unknown>;
    return String(v.imageUrl ?? v.url ?? "");
  }
  return "";
}

function toPublic(doc: Record<string, unknown> | null): BlogDoc | null {
  if (!doc) return null;
  return {
    id: String(doc._id),
    title: String(doc.title),
    slug: String(doc.slug),
    excerpt: String(doc.excerpt ?? ""),
    content: String(doc.content ?? ""),
    featuredImage: extractImageUrl(doc.featuredImage),
    category: String(doc.category ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    keywords: (doc.keywords as string[]) ?? [],
    schemaType: String(doc.schemaType ?? "Article"),
    status: (doc.status as "draft" | "published") ?? "draft",
    relatedSlugs: (doc.relatedSlugs as string[]) ?? [],
    faqs: (doc.faqs as { question: string; answer: string }[]) ?? [],
    createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as Date).toISOString() : undefined
  };
}

export async function getPublishedBlogs(limit?: number): Promise<BlogDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const q = BlogModel.find({ status: "published" }).sort({ createdAt: -1 }).lean();
  if (limit) void q.limit(limit);
  const rows = await q.exec();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean);
}

export async function getBlogBySlug(slug: string): Promise<BlogDoc | null> {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await BlogModel.findOne({ slug, status: "published" }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function getBlogBySlugAdmin(slug: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await BlogModel.findOne({ slug }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function getBlogById(id: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await BlogModel.findById(id).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function listBlogsAdmin(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "draft" | "published" | "all";
}) {
  if (!isMongoConfigured()) {
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
    return { total: 0, page: Math.max(1, params.page ?? 1), pageSize, items: [] };
  }
  await connectDB();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
  const filter: Record<string, unknown> = {};
  if (params.status && params.status !== "all") filter.status = params.status;
  if (params.search) {
    filter.$or = [
      { title: new RegExp(params.search, "i") },
      { slug: new RegExp(params.search, "i") },
      { excerpt: new RegExp(params.search, "i") }
    ];
  }
  const [total, rows] = await Promise.all([
    BlogModel.countDocuments(filter),
    BlogModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()
  ]);
  return { total, page, pageSize, items: rows.map((r) => toPublic(r as Record<string, unknown>)!) };
}

export async function countBlogs() {
  if (!isMongoConfigured()) return 0;
  await connectDB();
  return BlogModel.countDocuments();
}

export async function getRelatedBlogs(slugs: string[], excludeSlug: string): Promise<BlogDoc[]> {
  if (!isMongoConfigured()) return [];
  if (!slugs.length) return [];
  await connectDB();
  const rows = await BlogModel.find({
    slug: { $in: slugs, $ne: excludeSlug },
    status: "published"
  })
    .limit(6)
    .lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!);
}
