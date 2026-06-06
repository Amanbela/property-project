"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { slugify } from "@/utils/slug";
import { deleteImage, deleteMultipleImages } from "@/lib/cloudinary";

const cloudinaryImageSchema = z.object({
  imageUrl: z.string(),
  publicId: z.string()
});

const verificationChecklistSchema = z.object({
  legalApproved: z.boolean().default(false),
  reraApproved: z.boolean().default(false),
  possessionVerified: z.boolean().default(false),
}).default({});

const colonySchema = z.object({
  colonyName: z.string().min(2),
  slug: z.string().optional(),
  areaId: z.string().min(1, "Area is required"),
  areaName: z.string(),
  averagePlotPrice: z.coerce.number().min(0),
  averageFlatPrice: z.coerce.number().min(0),
  builderName: z.string().optional(),
  possessionStatus: z.enum(["Ready to Move", "Under Construction", "New Launch", "Pre Launch"]),
  amenities: z.array(z.string()),
  nearbySchools: z.array(z.string()),
  nearbyHospitals: z.array(z.string()),
  futureGrowthScore: z.coerce.number().min(0).max(100),
  investmentScore: z.coerce.number().min(0).max(100),
  familyScore: z.coerce.number().min(0).max(100),
  rentalDemand: z.coerce.number().min(0).max(100),
  trafficCondition: z.enum(["Low", "Moderate", "High"]),
  legalApprovalStatus: z.string().optional(),
  reraStatus: z.boolean(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  description: z.string().optional(),
  geoLocation: z.object({
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
  }).optional(),
  images: z.array(cloudinaryImageSchema),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  verificationChecklist: verificationChecklistSchema,
  published: z.boolean(),
});

async function assertAdmin() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function createColony(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = colonySchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.colonyName);

  try {
    await connectForWrites();

    const area = await AreaModel.findById(parsed.data.areaId).select("name").lean();
    if (!area) {
      return { ok: false as const, error: "Selected area not found" };
    }

    const { geoLocation, verificationChecklist, faqs, ...rest } = parsed.data;
    await ColonyModel.create({
      ...rest,
      slug,
      areaName: area.name,
      geoLocation,
      faqs,
      verificationChecklist
    });
    revalidatePath("/colonies");
    revalidatePath("/admin/colonies");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateColony(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = colonySchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.colonyName);

  try {
    await connectForWrites();

    const area = await AreaModel.findById(parsed.data.areaId).select("name").lean();
    if (!area) {
      return { ok: false as const, error: "Selected area not found" };
    }

    const { geoLocation, verificationChecklist, faqs, ...rest } = parsed.data;
    await ColonyModel.findByIdAndUpdate(id, {
      ...rest,
      slug,
      areaName: area.name,
      geoLocation,
      faqs,
      verificationChecklist
    }).exec();
    revalidatePath("/colonies");
    revalidatePath(`/colonies/${slug}`);
    revalidatePath("/admin/colonies");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteColony(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  const colony = await ColonyModel.findById(id).lean();
  if (colony) {
    const publicIds = (colony.images as { publicId?: string }[] || [])
      .map((img) => img.publicId)
      .filter(Boolean) as string[];
    if (publicIds.length > 0) {
      await deleteMultipleImages(publicIds);
    }

    const areaId = colony.areaId?.toString();
    if (areaId) {
      await AreaModel.findByIdAndUpdate(areaId, {
        $pull: { suggestedColonies: id }
      }).exec();
    }
  }

  await ColonyModel.findByIdAndDelete(id).exec();

  revalidatePath("/colonies");
  revalidatePath("/admin/colonies");
  return { ok: true as const };
}
