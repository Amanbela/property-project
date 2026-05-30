"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { SeoPageModel } from "@/infrastructure/seo/models/SeoPage";
import { slugify } from "@/utils/slug";

const faqSchema = z.object({ q: z.string(), a: z.string() });
const sectionSchema = z.object({ heading: z.string(), content: z.string() });

const seoSchema = z.object({
  slug: z.string().min(2),
  seoTitle: z.string().min(3),
  metaDescription: z.string().min(10),
  keyword: z.string().optional(),
  h1: z.string().min(2),
  intro: z.string().optional(),
  sections: z.array(sectionSchema),
  faqs: z.array(faqSchema),
  published: z.boolean(),
  articleSchemaJson: z.string().optional(),
  faqSchemaJson: z.string().optional()
});

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

export async function createSeoPage(formData: FormData): Promise<void> {
  if (!(await assertAdmin())) return;
  const parsed = parseSeoForm(formData);
  if (!parsed.ok) return;
  const slug = slugify(parsed.data.slug);
  try {
    await connectForWrites();
    await SeoPageModel.create({ ...parsed.data, slug });
    revalidatePath("/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/admin/seo-pages");
  } catch {
    /* ignore */
  }
}

export async function updateSeoPage(id: string, formData: FormData): Promise<void> {
  if (!(await assertAdmin())) return;
  const parsed = parseSeoForm(formData);
  if (!parsed.ok) return;
  const slug = slugify(parsed.data.slug);
  try {
    await connectForWrites();
    await SeoPageModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/admin/seo-pages");
  } catch {
    /* ignore */
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

function parseSeoForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  let sections: { heading: string; content: string }[] = [];
  let faqs: { q: string; a: string }[] = [];
  try {
    sections = JSON.parse(String(raw.sectionsJson || "[]"));
    faqs = JSON.parse(String(raw.faqsJson || "[]"));
  } catch {
    return { ok: false as const, error: "Invalid JSON for sections or FAQs" };
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
