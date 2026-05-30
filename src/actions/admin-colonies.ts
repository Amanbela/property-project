"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";
import { slugify } from "@/utils/slug";

const colonySchema = z.object({
  colonyName: z.string().min(2),
  slug: z.string().optional(),
  areaName: z.string().min(2),
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
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  images: z.array(z.string()),
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
    const { lat, lng, ...rest } = parsed.data;
    await ColonyModel.create({ 
      ...rest, 
      slug,
      geoLocation: { lat, lng }
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
    const { lat, lng, ...rest } = parsed.data;
    await ColonyModel.findByIdAndUpdate(id, { 
      ...rest, 
      slug,
      geoLocation: { lat, lng }
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
  await ColonyModel.findByIdAndDelete(id).exec();
  revalidatePath("/colonies");
  revalidatePath("/admin/colonies");
  return { ok: true as const };
}
