"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { slugify } from "@/utils/slug";
import { AreaSchema } from "@/shared/types/models";
import { deleteImage, deleteMultipleImages } from "@/lib/cloudinary";

const cloudinaryImageSchema = z.union([
  z.object({ imageUrl: z.string(), publicId: z.string() }),
  z.string()
]).transform((val) =>
  typeof val === "string" ? { imageUrl: val, publicId: "" } : val
);

const areaSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  averagePrice: z.coerce.number().min(0),
  investmentScore: z.coerce.number().min(0).max(10),
  familyScore: z.coerce.number().min(0).max(10),
  rentalDemand: z.coerce.number().min(0).max(10),
  futureGrowth: z.coerce.number().min(0).max(10),
  trafficCondition: z.coerce.number().min(0).max(10),
  nearbySchools: z.array(z.string()),
  nearbyHospitals: z.array(z.string()),
  nearbyMetro: z.boolean(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  lifestyleTags: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  featuredImage: cloudinaryImageSchema.optional().default({ imageUrl: "", publicId: "" }),
  gallery: z.array(cloudinaryImageSchema).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean()
});

async function assertAdmin() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function createArea(_prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const raw = Object.fromEntries(formData.entries());
  const splitCsv = (v: unknown) => String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const schools = formData.getAll("nearbySchools").map(String).filter(Boolean);
  const hospitals = formData.getAll("nearbyHospitals").map(String).filter(Boolean);
  const pros = formData.getAll("pros").map(String).filter(Boolean);
  const cons = formData.getAll("cons").map(String).filter(Boolean);
  const gallery = formData.getAll("gallery").map(String).filter(Boolean);
  const tags = formData.getAll("lifestyleTags").map(String).filter(Boolean);

  const parsed = areaSchema.safeParse({
    name: raw.name,
    slug: raw.slug || undefined,
    description: raw.description || "",
    averagePrice: raw.averagePrice,
    investmentScore: raw.investmentScore,
    familyScore: raw.familyScore,
    rentalDemand: raw.rentalDemand,
    futureGrowth: raw.futureGrowth,
    trafficCondition: raw.trafficCondition,
    nearbySchools: schools.length ? schools : splitCsv(raw.nearbySchoolsCsv),
    nearbyHospitals: hospitals.length ? hospitals : splitCsv(raw.nearbyHospitalsCsv),
    nearbyMetro: raw.nearbyMetro === "on" || raw.nearbyMetro === "true",
    coordinates: { lat: Number(raw.lat), lng: Number(raw.lng) },
    lifestyleTags: tags.length ? tags : splitCsv(raw.lifestyleTagsCsv),
    pros: pros.length ? pros : splitCsv(raw.prosCsv),
    cons: cons.length ? cons : splitCsv(raw.consCsv),
    featuredImage: raw.featuredImage || "",
    gallery: gallery.length ? gallery : splitCsv(raw.galleryCsv),
    seoTitle: raw.seoTitle || "",
    seoDescription: raw.seoDescription || "",
    published: raw.published === "on" || raw.published === "true"
  });

  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    await connectForWrites();
    await AreaModel.create({ ...parsed.data, slug });
    revalidatePath("/areas");
    revalidatePath("/admin/areas");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateArea(id: string, _prev: unknown, formData: FormData) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const raw = Object.fromEntries(formData.entries());
  const splitCsv = (v: unknown) => String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const schools = formData.getAll("nearbySchools").map(String).filter(Boolean);
  const hospitals = formData.getAll("nearbyHospitals").map(String).filter(Boolean);
  const pros = formData.getAll("pros").map(String).filter(Boolean);
  const cons = formData.getAll("cons").map(String).filter(Boolean);
  const gallery = formData.getAll("gallery").map(String).filter(Boolean);
  const tags = formData.getAll("lifestyleTags").map(String).filter(Boolean);

  const parsed = areaSchema.safeParse({
    name: raw.name,
    slug: raw.slug || undefined,
    description: raw.description || "",
    averagePrice: raw.averagePrice,
    investmentScore: raw.investmentScore,
    familyScore: raw.familyScore,
    rentalDemand: raw.rentalDemand,
    futureGrowth: raw.futureGrowth,
    trafficCondition: raw.trafficCondition,
    nearbySchools: schools.length ? schools : splitCsv(raw.nearbySchoolsCsv),
    nearbyHospitals: hospitals.length ? hospitals : splitCsv(raw.nearbyHospitalsCsv),
    nearbyMetro: raw.nearbyMetro === "on" || raw.nearbyMetro === "true",
    coordinates: { lat: Number(raw.lat), lng: Number(raw.lng) },
    lifestyleTags: tags.length ? tags : splitCsv(raw.lifestyleTagsCsv),
    pros: pros.length ? pros : splitCsv(raw.prosCsv),
    cons: cons.length ? cons : splitCsv(raw.consCsv),
    featuredImage: raw.featuredImage || "",
    gallery: gallery.length ? gallery : splitCsv(raw.galleryCsv),
    seoTitle: raw.seoTitle || "",
    seoDescription: raw.seoDescription || "",
    published: raw.published === "on" || raw.published === "true"
  });

  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    await connectForWrites();
    await AreaModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/areas");
    revalidatePath(`/areas/${slug}`);
    revalidatePath("/admin/areas");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteArea(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  const area = await AreaModel.findById(id).lean();
  if (area) {
    const publicIds: string[] = [];
    if (area.featuredImage && typeof area.featuredImage === "object") {
      const fi = area.featuredImage as { publicId?: string };
      if (fi.publicId) publicIds.push(fi.publicId);
    }
    if (area.gallery && Array.isArray(area.gallery)) {
      area.gallery.forEach((g: unknown) => {
        if (g && typeof g === "object") {
          const img = g as { publicId?: string };
          if (img.publicId) publicIds.push(img.publicId);
        }
      });
    }
    if (publicIds.length > 0) {
      await deleteMultipleImages(publicIds);
    }
  }
  await AreaModel.findByIdAndDelete(id).exec();
  revalidatePath("/areas");
  revalidatePath("/admin/areas");
  revalidatePath("/");
  return { ok: true as const };
}

export async function createAreaDirect(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = AreaSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    await connectForWrites();
    await AreaModel.create({ ...parsed.data, slug });
    revalidatePath("/areas");
    revalidatePath("/admin/areas");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateAreaDirect(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = AreaSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  try {
    await connectForWrites();
    await AreaModel.findByIdAndUpdate(id, { ...parsed.data, slug }).exec();
    revalidatePath("/areas");
    revalidatePath(`/areas/${slug}`);
    revalidatePath("/admin/areas");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}
