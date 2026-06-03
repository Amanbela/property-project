"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";
import { BudgetRangeSchema } from "@/shared/types/models";
import { slugify } from "@/utils/slug";

const budgetRangeSchema = z.object({
  label: z.string().min(2),
  slug: z.string().optional(),
  minPrice: z.coerce.number().min(0),
  maxPrice: z.coerce.number().min(0),
  description: z.string().optional(),
  heroHeading: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  recommendedAreas: z.array(z.string()),
  whyThisBudget: z.string().optional(),
  tipForBuyers: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().min(0).default(0)
});

async function assertAdmin() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function createBudgetRange(_prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const areas = formData.getAll("recommendedAreas").map(String).filter(Boolean);

  const parsed = budgetRangeSchema.safeParse({
    label: raw.label,
    slug: raw.slug || undefined,
    minPrice: raw.minPrice,
    maxPrice: raw.maxPrice,
    description: raw.description || "",
    heroHeading: raw.heroHeading || "",
    metaTitle: raw.metaTitle || "",
    metaDescription: raw.metaDescription || "",
    recommendedAreas: areas,
    whyThisBudget: raw.whyThisBudget || "",
    tipForBuyers: raw.tipForBuyers || "",
    isActive: raw.isActive === "on" || raw.isActive === "true",
    sortOrder: raw.sortOrder || 0
  });

  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.label);

  try {
    await connectForWrites();
    await BudgetRangeModel.create({ ...parsed.data, slug });
    revalidatePath("/budget");
    revalidatePath("/admin/budget-ranges");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateBudgetRange(id: string, _prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const areas = formData.getAll("recommendedAreas").map(String).filter(Boolean);

  const parsed = budgetRangeSchema.safeParse({
    label: raw.label,
    slug: raw.slug || undefined,
    minPrice: raw.minPrice,
    maxPrice: raw.maxPrice,
    description: raw.description || "",
    heroHeading: raw.heroHeading || "",
    metaTitle: raw.metaTitle || "",
    metaDescription: raw.metaDescription || "",
    recommendedAreas: areas,
    whyThisBudget: raw.whyThisBudget || "",
    tipForBuyers: raw.tipForBuyers || "",
    isActive: raw.isActive === "on" || raw.isActive === "true",
    sortOrder: raw.sortOrder || 0
  });

  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.label);

  try {
    await connectForWrites();
    await BudgetRangeModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/budget");
    revalidatePath(`/budget/${slug}`);
    revalidatePath("/admin/budget-ranges");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteBudgetRange(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await BudgetRangeModel.findByIdAndDelete(id).exec();
  revalidatePath("/budget");
  revalidatePath("/admin/budget-ranges");
  revalidatePath("/");
  return { ok: true as const };
}

export async function getBudgetRanges() {
  if (!(await assertAdmin())) return [];
  await connectForWrites();
  const docs = await BudgetRangeModel.find({}).sort({ sortOrder: 1 }).lean().exec();
  return docs.map(doc => ({ ...doc, _id: String(doc._id) }));
}

export async function getBudgetRangeById(id: string) {
  if (!(await assertAdmin())) return null;
  await connectForWrites();
  const doc = await BudgetRangeModel.findById(id).lean().exec();
  if (!doc) return null;
  return { ...doc, _id: String(doc._id) };
}

export async function reorderBudgetRanges(ids: string[]) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  try {
    await connectForWrites();
    const updates = ids.map((id, index) =>
      BudgetRangeModel.findByIdAndUpdate(id, { sortOrder: index }).exec()
    );
    await Promise.all(updates);
    revalidatePath("/admin/budget-ranges");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function createBudgetRangeDirect(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BudgetRangeSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.label);

  try {
    await connectForWrites();
    await BudgetRangeModel.create({ ...parsed.data, slug });
    revalidatePath("/budget");
    revalidatePath("/admin/budget-ranges");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateBudgetRangeDirect(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BudgetRangeSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.label);

  try {
    await connectForWrites();
    await BudgetRangeModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/budget");
    revalidatePath(`/budget/${slug}`);
    revalidatePath("/admin/budget-ranges");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}
