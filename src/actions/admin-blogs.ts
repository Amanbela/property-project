"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { BlogModel } from "@/infrastructure/seo/models/Blog";
import { slugify } from "@/utils/slug";

const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  keywords: z.array(z.string()),
  schemaType: z.string().optional(),
  status: z.enum(["draft", "published"]),
  relatedSlugs: z.array(z.string())
});

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

export async function createBlog(_prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const raw = Object.fromEntries(formData.entries());
  const keywords = formData.getAll("keywords").map(String).filter(Boolean);
  const related = formData.getAll("relatedSlugs").map(String).filter(Boolean);
  const split = (v: unknown) => String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const parsed = blogSchema.safeParse({
    title: raw.title,
    slug: raw.slug || undefined,
    excerpt: raw.excerpt || "",
    content: raw.content || "",
    category: raw.category || "",
    featuredImage: raw.featuredImage || "",
    seoTitle: raw.seoTitle || "",
    seoDescription: raw.seoDescription || "",
    keywords: keywords.length ? keywords : split(raw.keywordsCsv),
    schemaType: raw.schemaType || "Article",
    status: raw.status === "published" ? "published" : "draft",
    relatedSlugs: related.length ? related : split(raw.relatedSlugsCsv)
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  const slug = parsed.data.slug?.length ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  try {
    await connectForWrites();
    await BlogModel.create({ ...parsed.data, slug });
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateBlog(id: string, _prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const raw = Object.fromEntries(formData.entries());
  const keywords = formData.getAll("keywords").map(String).filter(Boolean);
  const related = formData.getAll("relatedSlugs").map(String).filter(Boolean);
  const split = (v: unknown) => String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const parsed = blogSchema.safeParse({
    title: raw.title,
    slug: raw.slug || undefined,
    excerpt: raw.excerpt || "",
    content: raw.content || "",
    category: raw.category || "",
    featuredImage: raw.featuredImage || "",
    seoTitle: raw.seoTitle || "",
    seoDescription: raw.seoDescription || "",
    keywords: keywords.length ? keywords : split(raw.keywordsCsv),
    schemaType: raw.schemaType || "Article",
    status: raw.status === "published" ? "published" : "draft",
    relatedSlugs: related.length ? related : split(raw.relatedSlugsCsv)
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  const slug = parsed.data.slug?.length ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  try {
    await connectForWrites();
    await BlogModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function autosaveBlogDraft(id: string, content: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await BlogModel.findByIdAndUpdate(id, { content, lastAutosavedAt: new Date() }).exec();
  return { ok: true as const };
}

export async function deleteBlog(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await BlogModel.findByIdAndDelete(id).exec();
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  revalidatePath("/");
  return { ok: true as const };
}
