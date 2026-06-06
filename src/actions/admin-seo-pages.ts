"use server";

import { revalidatePath } from "next/cache";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { SeoPageModel } from "@/infrastructure/seo/models/SeoPage";
import { slugify } from "@/utils/slug";
import { SeoPageImportSchema } from "@/shared/types/models";

const seoSchema = SeoPageImportSchema;

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

function parseSeoForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  let sections: { heading: string; content: string }[] = [];
  let faqs: { q: string; a: string }[] = [];
  try {
    sections = JSON.parse(String(raw.sectionsJson || "[]"));
    faqs = JSON.parse(String(raw.faqsJson || "[]"));
  } catch {
    return { ok: false as const, error: "Invalid JSON for sections or FAQs" as const };
  }
  const parsed = seoSchema.safeParse({
    slug: raw.slug,
    seoTitle: raw.seoTitle,
    metaDescription: raw.metaDescription,
    keyword: raw.keyword || "",
    h1: raw.h1,
    intro: raw.intro || "",
    sections,
    faqs,
    published: raw.published === "on" || raw.published === "true",
    articleSchemaJson: raw.articleSchemaJson || "",
    faqSchemaJson: raw.faqSchemaJson || ""
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  return { ok: true as const, data: parsed.data };
}

export async function createSeoPage(_prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const parsed = parseSeoForm(formData);
  if (!parsed.ok) return parsed;
  const slug = slugify(parsed.data.slug);
  try {
    await connectForWrites();
    await SeoPageModel.create({ ...parsed.data, slug });
    revalidatePath("/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/admin/seo-pages");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function createSeoPageDirect(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = seoSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = slugify(parsed.data.slug);
  try {
    await connectForWrites();
    await SeoPageModel.create({ ...parsed.data, slug });
    revalidatePath("/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/admin/seo-pages");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateSeoPage(id: string, _prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const parsed = parseSeoForm(formData);
  if (!parsed.ok) return parsed;
  const slug = slugify(parsed.data.slug);
  try {
    await connectForWrites();
    await SeoPageModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/admin/seo-pages");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteSeoPage(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await SeoPageModel.findByIdAndDelete(id).exec();
  revalidatePath("/guides");
  revalidatePath("/admin/seo-pages");
  return { ok: true as const };
}
