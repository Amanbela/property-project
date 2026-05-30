import { connectDB } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";

export type PurposeType = "investment" | "family-living" | "rental-income";
export type PropertyType = "plot" | "flat" | "villa";
export type LifestyleType = "luxury" | "affordable" | "family-friendly" | "high-growth" | "premium";

export interface RecommendationInput {
  budgetMin: number;
  budgetMax: number;
  purpose: PurposeType;
  propertyType: PropertyType;
  lifestyle: LifestyleType;
  preferredLocation?: string;
}

export interface AreaRecommendationResult {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredImage: string;
  averagePrice: number;
  investmentScore: number;
  familyScore: number;
  futureGrowth: number;
  rentalDemand: number;
  matchScore: number;
  suggestedColonies: Array<{
    colonyName: string;
    slug: string;
    averagePlotPrice: number;
    averageFlatPrice: number;
    reraStatus: boolean;
  }>;
  whyRecommended: string[];
}

interface AreaDoc {
  _id: { toString: () => string };
  name: string;
  slug: string;
  description?: string;
  averagePricePerSqft?: number;
  averagePrice?: number;
  investmentScore?: number;
  familyScore?: number;
  rentalDemand?: number;
  futureGrowth?: number;
  trafficCondition?: number;
  trafficScore?: number;
  nearbySchools?: string[];
  nearbyHospitals?: string[];
  nearbyMetro?: boolean;
  featuredImage?: string;
  lifestyleTags?: string[];
}

interface ColonyDoc {
  colonyName: string;
  slug: string;
  averagePlotPrice?: number;
  averageFlatPrice?: number;
  reraStatus?: boolean;
}

export async function getRecommendationsForUser(
  input: RecommendationInput
): Promise<AreaRecommendationResult[]> {
  await connectDB();
  const { budgetMin, budgetMax, purpose, propertyType, lifestyle, preferredLocation } = input;

  // 1. Fetch all published areas
  const rawAreas = await AreaModel.find({ published: true }).lean().exec();
  const areas = rawAreas as unknown as AreaDoc[];

  // Normalization helper (scale 0-10 up to 0-100 if necessary)
  const norm = (val?: number) => {
    if (val === undefined || val === null) return 0;
    return val <= 10 ? val * 10 : val;
  };

  const scoredAreas = await Promise.all(
    areas.map(async (area) => {
      // Price per sqft
      const pricePerSqft = Number(area.averagePricePerSqft || area.averagePrice || 0);

      // Estimate size based on property type
      const sizeSqft = propertyType === "plot" ? 1200 : propertyType === "flat" ? 1000 : 1800;
      const estimatedPropertyPrice = pricePerSqft * sizeSqft;

      // A. Calculate Budget Compatibility Score
      let budgetScore = 0;
      if (estimatedPropertyPrice <= budgetMax && estimatedPropertyPrice >= budgetMin) {
        budgetScore = 100;
      } else if (estimatedPropertyPrice < budgetMin) {
        budgetScore = 95;
      } else if (estimatedPropertyPrice <= budgetMax * 1.25) {
        budgetScore = 60;
      } else {
        budgetScore = 20;
      }

      // B. Calculate Purpose suitabilities
      const invScore = norm(area.investmentScore || 0);
      const growthScore = norm(area.futureGrowth || 0);
      const demandScore = norm(area.rentalDemand || 0);
      const familyScore = norm(area.familyScore || 0);

      let trafficScore = 60;
      if (area.trafficScore !== undefined) {
        trafficScore = norm(area.trafficScore);
      } else if (area.trafficCondition !== undefined) {
        trafficScore = norm(area.trafficCondition);
      }

      const schoolsCount = area.nearbySchools?.length || 0;
      const schoolsScore = Math.min(100, schoolsCount * 35 + 30);

      const hospitalsCount = area.nearbyHospitals?.length || 0;
      const hospitalsScore = Math.min(100, hospitalsCount * 35 + 30);

      // Calculate weighted score based on purpose
      let purposeScore = 0;
      if (purpose === "investment") {
        purposeScore =
          invScore * 0.40 +
          growthScore * 0.30 +
          demandScore * 0.20 +
          trafficScore * 0.10;
      } else if (purpose === "family-living") {
        purposeScore =
          familyScore * 0.40 +
          schoolsScore * 0.20 +
          hospitalsScore * 0.20 +
          trafficScore * 0.20;
      } else if (purpose === "rental-income") {
        purposeScore =
          demandScore * 0.40 +
          invScore * 0.20 +
          growthScore * 0.20 +
          trafficScore * 0.20;
      } else {
        purposeScore = (invScore + familyScore + demandScore) / 3;
      }

      // C. Calculate Lifestyle Boost (+10 if tags match)
      let lifestyleBoost = 0;
      const tags = (area.lifestyleTags || []).map((t) => t.toLowerCase());
      if (tags.includes(lifestyle.toLowerCase())) {
        lifestyleBoost = 10;
      }

      // D. Calculate Preferred Location Boost (+25 if matches)
      let locationBoost = 0;
      if (
        preferredLocation &&
        area.name.toLowerCase().includes(preferredLocation.toLowerCase())
      ) {
        locationBoost = 25;
      }

      // Final total match score combines purpose (70%) + budget (30%) + boosts
      let matchScore = Math.round(purposeScore * 0.70 + budgetScore * 0.30 + lifestyleBoost + locationBoost);
      matchScore = Math.max(0, Math.min(100, matchScore));

      // E. Fetch top 2-3 colonies for this area as supporting recommendations
      const rawColonies = await ColonyModel.find({
        areaName: area.name,
        published: true,
      })
        .sort({ investmentScore: -1, familyScore: -1 })
        .limit(3)
        .lean()
        .exec();
      const colonies = rawColonies as unknown as ColonyDoc[];

      const formattedColonies = colonies.map((col) => ({
        colonyName: col.colonyName,
        slug: col.slug,
        averagePlotPrice: col.averagePlotPrice || 0,
        averageFlatPrice: col.averageFlatPrice || 0,
        reraStatus: col.reraStatus || false,
      }));

      // F. Generate Dynamic "Why Recommended" reasons
      const whyRecommended: string[] = [];
      if (budgetScore >= 90) {
        whyRecommended.push("Fits your selected budget");
      } else if (budgetScore >= 60) {
        whyRecommended.push("Highly premium option within range");
      }

      if (purpose === "investment") {
        if (growthScore >= 80) whyRecommended.push("High future growth & masterplan corridor");
        if (invScore >= 80) whyRecommended.push("Strong investment appreciation potential");
        if (demandScore >= 80) whyRecommended.push("High developer activity zone");
      } else if (purpose === "family-living") {
        if (familyScore >= 80) whyRecommended.push("Top-rated family-friendly community");
        if (schoolsCount >= 1) whyRecommended.push("Excellent premium schools nearby");
        if (hospitalsCount >= 1) whyRecommended.push("Close to top-tier multi-specialty hospitals");
      } else {
        if (demandScore >= 80) whyRecommended.push("Strong rental demand & occupancy rates");
        if (growthScore >= 80) whyRecommended.push("Rapidly developing residential corridor");
      }

      if (trafficScore >= 70) {
        whyRecommended.push("Excellent connectivity & low traffic congestion");
      }
      if (area.nearbyMetro) {
        whyRecommended.push("Proximity to Indore Metro route corridor");
      }

      if (whyRecommended.length === 0) {
        whyRecommended.push("Balanced lifestyle infrastructure");
        whyRecommended.push("Vetted high-quality developer choices");
      }

      return {
        id: area._id.toString(),
        name: area.name,
        slug: area.slug,
        description: area.description || "",
        featuredImage: area.featuredImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
        averagePrice: pricePerSqft,
        investmentScore: Math.round(invScore),
        familyScore: Math.round(familyScore),
        futureGrowth: Math.round(growthScore),
        rentalDemand: Math.round(demandScore),
        matchScore,
        suggestedColonies: formattedColonies,
        whyRecommended: whyRecommended.slice(0, 4),
      };
    })
  );

  return scoredAreas.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}
