import type { Area } from "@/types";
import { Lifestyle, Purpose } from "@/types";

export type PurposeWeights = {
  budgetCompatibility: number;
  appreciationPotential: number;
  rentalDemand: number;
  trafficScore: number;
  familyFriendliness: number;
  luxuryPreference: number;
  connectivity: number;
  socialInfrastructure: number;
};

export const defaultPurposeWeights: Record<Purpose, PurposeWeights> = {
  investment: {
    budgetCompatibility: 0.2,
    appreciationPotential: 0.24,
    rentalDemand: 0.18,
    trafficScore: 0.06,
    familyFriendliness: 0.08,
    luxuryPreference: 0.08,
    connectivity: 0.1,
    socialInfrastructure: 0.06
  },
  "family-living": {
    budgetCompatibility: 0.16,
    appreciationPotential: 0.14,
    rentalDemand: 0.08,
    trafficScore: 0.1,
    familyFriendliness: 0.22,
    luxuryPreference: 0.06,
    connectivity: 0.12,
    socialInfrastructure: 0.12
  },
  "rental-income": {
    budgetCompatibility: 0.18,
    appreciationPotential: 0.16,
    rentalDemand: 0.24,
    trafficScore: 0.06,
    familyFriendliness: 0.08,
    luxuryPreference: 0.06,
    connectivity: 0.14,
    socialInfrastructure: 0.08
  }
};

function mergeWeights(
  base: Record<Purpose, PurposeWeights>,
  override?: Partial<Record<Purpose, Partial<PurposeWeights>>> | null
): Record<Purpose, PurposeWeights> {
  if (!override) return base;
  const out = structuredClone(base) as Record<Purpose, PurposeWeights>;
  (Object.keys(override) as Purpose[]).forEach((p) => {
    const o = override[p];
    if (!o) return;
    out[p] = { ...out[p], ...o };
  });
  return out;
}

function normalizeScore10(value: number): number {
  return Math.max(0, Math.min(100, value * 10));
}

function getBudgetCompatibility(areaAveragePrice: number, totalBudget: number): number {
  const targetPricePerSqFt = totalBudget / 1200;
  const diff = Math.abs(areaAveragePrice - targetPricePerSqFt);
  return Math.max(0, 100 - (diff / Math.max(targetPricePerSqFt, 1)) * 100);
}

function getLuxuryPreference(tags: Lifestyle[], preferredLifestyle: Lifestyle): number {
  const wantsLuxury = preferredLifestyle === "luxury" || preferredLifestyle === "premium";
  if (!wantsLuxury) return tags.includes(preferredLifestyle) ? 85 : 65;
  if (tags.includes("luxury") || tags.includes("premium")) return 95;
  return 45;
}

export function getRecommendations(
  areas: Area[],
  input: {
    budget: number;
    purpose: Purpose;
    lifestyle: Lifestyle;
  },
  options?: { weightsOverrideJson?: string | null }
) {
  let purposeWeight = defaultPurposeWeights;
  if (options?.weightsOverrideJson) {
    try {
      const parsed = JSON.parse(options.weightsOverrideJson) as Partial<Record<Purpose, Partial<PurposeWeights>>>;
      purposeWeight = mergeWeights(defaultPurposeWeights, parsed);
    } catch {
      purposeWeight = defaultPurposeWeights;
    }
  }

  const w = purposeWeight[input.purpose];

  const ranked = areas.map((area) => {
    const budgetCompatibility = getBudgetCompatibility(area.averagePrice, input.budget);
    const appreciationPotential = normalizeScore10((area.investmentScore + area.futureGrowth) / 2);
    const rentalDemand = normalizeScore10(area.rentalDemand);
    const trafficScore = normalizeScore10(area.trafficCondition);
    const familyFriendliness = normalizeScore10(area.familyScore);
    const luxuryPreference = getLuxuryPreference(area.lifestyleTags, input.lifestyle);
    const connectivity = Math.min(
      100,
      normalizeScore10(area.trafficCondition) * 0.6 + (area.nearbyMetro ? 40 : 20)
    );
    const socialInfrastructure = Math.min(
      100,
      area.nearbySchools.length * 22 + area.nearbyHospitals.length * 22
    );

    const weightedScore =
      budgetCompatibility * w.budgetCompatibility +
      appreciationPotential * w.appreciationPotential +
      rentalDemand * w.rentalDemand +
      trafficScore * w.trafficScore +
      familyFriendliness * w.familyFriendliness +
      luxuryPreference * w.luxuryPreference +
      connectivity * w.connectivity +
      socialInfrastructure * w.socialInfrastructure;

    return {
      ...area,
      recommendationScore: Math.round(weightedScore),
      dimensionScores: {
        budgetCompatibility: Math.round(budgetCompatibility),
        appreciationPotential: Math.round(appreciationPotential),
        rentalDemand: Math.round(rentalDemand),
        trafficScore: Math.round(trafficScore),
        familyFriendliness: Math.round(familyFriendliness),
        luxuryPreference: Math.round(luxuryPreference),
        connectivity: Math.round(connectivity),
        socialInfrastructure: Math.round(socialInfrastructure)
      },
      explanationSummary: `${area.name} matches your ${input.purpose.replace("-", " ")} goal with strong budget fit, ${area.futureGrowth >= 8 ? "high" : "steady"} appreciation potential, and solid connectivity.`,
      investmentInsight:
        area.futureGrowth >= 9 && area.rentalDemand >= 8
          ? "High-conviction opportunity for medium-to-long term capital growth plus rental cash flow."
          : area.futureGrowth >= 8
            ? "Good long-term upside with balanced risk profile."
            : "Stable performer best suited for conservative entry and end-use."
    };
  });

  ranked.sort((a, b) => b.recommendationScore - a.recommendationScore);

  const top3 = ranked.slice(0, 3);
  const scoreLead = top3[0]?.recommendationScore ?? 0;
  const scoreGap = (top3[0]?.recommendationScore ?? 0) - (top3[1]?.recommendationScore ?? 0);
  const confidence = Math.min(98, Math.max(55, Math.round(scoreLead * 0.75 + scoreGap * 1.5)));

  return {
    recommendationConfidence: confidence,
    topAreas: top3,
    explanationSummary: top3.length
      ? `Top match ${top3[0].name} leads with a score of ${top3[0].recommendationScore}/100. ${top3[1] ? `${top3[1].name} and ${top3[2]?.name ?? "the next ranked area"} are close alternatives.` : ""}`
      : "No strong matches found for the selected combination.",
    investmentInsight: top3.length
      ? top3[0].investmentInsight
      : "Try adjusting budget and preference inputs for better investment alignment.",
    /** AI-ready structured payload */
    modelContext: {
      purpose: input.purpose,
      lifestyle: input.lifestyle,
      budget: input.budget,
      weightsUsed: w,
      candidateCount: areas.length
    }
  };
}
