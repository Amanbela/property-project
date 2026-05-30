import type { Area, Lifestyle } from "@/types";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";
import type { Colony as ColonyType } from "@/shared/types/models";

export type AreaDoc = Area & {
  id: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  budgetCategory?: string[];
  propertyTypes?: string[];
  trafficScore?: number;
  tags?: string[];
  connectivity?: {
    metroDistanceKm: number;
    airportDistanceKm: number;
    railwayDistanceKm: number;
  };
  nearbyMalls?: string[];
  nearbyITHubs?: string[];
  featured?: boolean;
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

function extractImageUrls(vals: unknown): string[] {
  if (!vals) return [];
  if (!Array.isArray(vals)) return [];
  return vals.map((v) => extractImageUrl(v)).filter(Boolean);
}

function toPublic(doc: Record<string, unknown> | null): AreaDoc | null {
  if (!doc) return null;
  const o = doc as Record<string, unknown>;
  const id = String(o._id);
  return {
    id,
    name: String(o.name),
    slug: String(o.slug),
    description: String(o.description ?? ""),
    averagePrice: Number(o.averagePrice ?? o.averagePricePerSqft ?? 0),
    investmentScore: Number(o.investmentScore ?? 0),
    familyScore: Number(o.familyScore ?? 0),
    rentalDemand: Number(o.rentalDemand ?? 0),
    futureGrowth: Number(o.futureGrowth ?? 0),
    trafficCondition: Number(o.trafficCondition ?? 0),
    trafficScore: o.trafficScore ? Number(o.trafficScore) : undefined,
    budgetCategory: (o.budgetCategory as string[]) ?? undefined,
    propertyTypes: (o.propertyTypes as string[]) ?? undefined,
    tags: (o.tags as string[]) ?? undefined,
    connectivity: o.connectivity
      ? {
          metroDistanceKm: Number((o.connectivity as Record<string, number>).metroDistanceKm ?? 0),
          airportDistanceKm: Number((o.connectivity as Record<string, number>).airportDistanceKm ?? 0),
          railwayDistanceKm: Number((o.connectivity as Record<string, number>).railwayDistanceKm ?? 0),
        }
      : undefined,
    nearbySchools: (o.nearbySchools as string[]) ?? [],
    nearbyHospitals: (o.nearbyHospitals as string[]) ?? [],
    nearbyMalls: (o.nearbyMalls as string[]) ?? undefined,
    nearbyITHubs: (o.nearbyITHubs as string[]) ?? undefined,
    nearbyMetro: Boolean(o.nearbyMetro),
    coordinates: {
      lat: Number((o.coordinates as { lat?: number })?.lat ?? 0),
      lng: Number((o.coordinates as { lng?: number })?.lng ?? 0)
    },
    featuredImage: extractImageUrl(o.featuredImage),
    gallery: extractImageUrls(o.gallery),
    pros: (o.pros as string[]) ?? [],
    cons: (o.cons as string[]) ?? [],
    lifestyleTags: (o.lifestyleTags as Area["lifestyleTags"]) ?? [],
    featured: Boolean(o.featured ?? false),
    createdAt: o.createdAt ? new Date(o.createdAt as Date).toISOString() : new Date().toISOString(),
    published: Boolean(o.published ?? true),
    seoTitle: o.seoTitle ? String(o.seoTitle) : undefined,
    seoDescription: o.seoDescription ? String(o.seoDescription) : undefined,
    viewCount: Number(o.viewCount ?? 0),
    updatedAt: o.updatedAt ? new Date(o.updatedAt as Date).toISOString() : undefined
  };
}

export async function getPublishedAreas(limit?: number): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const q = AreaModel.find({ published: true }).sort({ investmentScore: -1 }).lean();
  if (limit) void q.limit(limit);
  const rows = await q.exec();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean);
}

export function mapAreaDocToArea(d: AreaDoc): Area {
  return {
    name: d.name,
    slug: d.slug,
    description: d.description,
    averagePrice: d.averagePrice,
    investmentScore: d.investmentScore,
    familyScore: d.familyScore,
    rentalDemand: d.rentalDemand,
    futureGrowth: d.futureGrowth,
    trafficCondition: d.trafficCondition,
    nearbySchools: d.nearbySchools,
    nearbyHospitals: d.nearbyHospitals,
    nearbyMetro: d.nearbyMetro,
    coordinates: d.coordinates,
    featuredImage: d.featuredImage,
    gallery: d.gallery,
    pros: d.pros,
    cons: d.cons,
    lifestyleTags: (d.lifestyleTags ?? []) as Lifestyle[],
    createdAt: d.createdAt ?? new Date().toISOString()
  };
}

export async function getAreasForRecommendation(): Promise<Area[]> {
  const docs = await getPublishedAreas();
  return docs.map(mapAreaDocToArea);
}

export async function getAreaBySlug(slug: string, opts?: { incrementViews?: boolean }): Promise<AreaDoc | null> {
  if (!isMongoConfigured()) return null;
  await connectDB();
  if (opts?.incrementViews) {
    await AreaModel.updateOne({ slug, published: true }, { $inc: { viewCount: 1 } }).exec();
  }
  const doc = await AreaModel.findOne({ slug, published: true }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function getAreaBySlugAdmin(slug: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await AreaModel.findOne({ slug }).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function getAreaById(id: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await AreaModel.findById(id).lean();
  return toPublic(doc as Record<string, unknown> | null);
}

export async function listAreasAdmin(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  publishedOnly?: boolean | null;
}) {
  if (!isMongoConfigured()) {
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
    return { total: 0, page: Math.max(1, params.page ?? 1), pageSize, items: [] };
  }
  await connectDB();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
  const filter: Record<string, unknown> = {};
  if (params.search) {
    filter.$or = [
      { name: new RegExp(params.search, "i") },
      { slug: new RegExp(params.search, "i") },
      { description: new RegExp(params.search, "i") }
    ];
  }
  if (params.publishedOnly === true) filter.published = true;
  if (params.publishedOnly === false) filter.published = false;

  const [total, rows] = await Promise.all([
    AreaModel.countDocuments(filter),
    AreaModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()
  ]);
  return {
    total,
    page,
    pageSize,
    items: rows.map((r) => toPublic(r as Record<string, unknown>)!)
  };
}

export async function getTopViewedAreas(limit = 5): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await AreaModel.find({ published: true }).sort({ viewCount: -1 }).limit(limit).lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!);
}

export async function countAreas() {
  if (!isMongoConfigured()) return 0;
  await connectDB();
  return AreaModel.countDocuments();
}

export async function countPublishedAreas() {
  if (!isMongoConfigured()) return 0;
  await connectDB();
  return AreaModel.countDocuments({ published: true });
}

// ─── Homepage Dynamic Sections ─────────────────────────────────

export async function getTopInvestmentAreas(limit = 3): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await AreaModel.find({ published: true })
    .sort({ investmentScore: -1 })
    .limit(limit)
    .lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean) as AreaDoc[];
}

export async function getTopFamilyAreas(limit = 3): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await AreaModel.find({ published: true })
    .sort({ familyScore: -1 })
    .limit(limit)
    .lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean) as AreaDoc[];
}

export async function getTopGrowthAreas(limit = 3): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await AreaModel.find({ published: true })
    .sort({ futureGrowth: -1 })
    .limit(limit)
    .lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean) as AreaDoc[];
}

export async function getTopRentalAreas(limit = 3): Promise<AreaDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await AreaModel.find({ published: true })
    .sort({ rentalDemand: -1 })
    .limit(limit)
    .lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean) as AreaDoc[];
}

// ─── Area Detail Page Data ───────────────────────────────────────
// Returns area + its colonies + related areas for the detail page

export interface AreaDetailData {
  area: AreaDoc;
  colonies: ColonyType[];
  relatedAreas: AreaDoc[];
}

export async function getAreaDetailData(slug: string): Promise<AreaDetailData | null> {
  if (!isMongoConfigured()) return null;
  await connectDB();

  const doc = await AreaModel.findOne({ slug, published: true }).lean();
  if (!doc) return null;

  const area = toPublic(doc as Record<string, unknown>);
  if (!area) return null;

  const areaId = String(doc._id);

  const [colonies, allAreas] = await Promise.all([
    ColonyModel.find({ areaId, published: true })
      .sort({ investmentScore: -1 })
      .limit(4)
      .lean(),
    AreaModel.find({ published: true, slug: { $ne: slug } })
      .sort({ investmentScore: -1 })
      .limit(4)
      .lean(),
  ]);

  return {
    area,
    colonies: colonies.map((c) => ({
      _id: String(c._id),
      colonyName: c.colonyName,
      slug: c.slug,
      areaName: c.areaName ?? area.name,
      averagePlotPrice: c.averagePlotPrice ?? 0,
      averageFlatPrice: c.averageFlatPrice ?? 0,
      builderName: c.builderName,
      possessionStatus: c.possessionStatus ?? "Ready to Move",
      amenities: c.amenities ?? [],
      nearbySchools: c.nearbySchools ?? [],
      nearbyHospitals: c.nearbyHospitals ?? [],
      futureGrowthScore: c.futureGrowthScore ?? 0,
      investmentScore: c.investmentScore ?? 0,
      familyScore: c.familyScore ?? 0,
      rentalDemand: c.rentalDemand ?? 0,
      trafficCondition: c.trafficCondition ?? "Moderate",
      legalApprovalStatus: c.legalApprovalStatus,
      reraStatus: c.reraStatus ?? false,
      propertyTypes: c.propertyTypes ?? [],
      pros: c.pros ?? [],
      cons: c.cons ?? [],
      description: c.description,
      images: c.images ?? [],
      faqs: c.faqs ?? [],
      verificationChecklist: {
        legalApproved: c.verificationChecklist?.legalApproved ?? false,
        reraApproved: c.verificationChecklist?.reraApproved ?? false,
        possessionVerified: c.verificationChecklist?.possessionVerified ?? false,
      },
      published: c.published ?? true,
      viewCount: c.viewCount ?? 0,
    })),
    relatedAreas: allAreas.map((r) => toPublic(r as Record<string, unknown>)!).filter(Boolean) as AreaDoc[],
  };
}
