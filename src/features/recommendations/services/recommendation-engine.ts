import type { PurposeType, PropertyType } from "../store/wizard-store";
import { Colony } from "@/shared/types/models";

// Weights matching the user's requested architecture
const WEIGHTS = {
  BUDGET: 0.40,
  FUTURE_GROWTH: 0.25,
  FAMILY: 0.15,
  CONNECTIVITY: 0.10,
  BUILDER_TRUST: 0.10,
};

export interface RecommendationResult {
  colony: Colony;
  totalScore: number;
  matchReasons: string[];
}

export interface UserPreferences {
  budgetMin: number;
  budgetMax: number;
  propertyType: PropertyType | "";
  purpose: PurposeType | "";
}

export function calculateRecommendationScore(
  colony: Colony,
  user: UserPreferences
): RecommendationResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Budget Fit (40%)
  const price = user.propertyType && user.propertyType.toLowerCase() === "plot" 
    ? colony.averagePlotPrice 
    : colony.averageFlatPrice;
    
  let budgetScore = 0;
  if (price >= user.budgetMin && price <= user.budgetMax) {
    budgetScore = 100;
    reasons.push("Perfectly matches your budget");
  } else if (price < user.budgetMin) {
    // Under budget is good
    budgetScore = 80;
    reasons.push("Well under your maximum budget");
  } else if (price > user.budgetMax && price <= user.budgetMax * 1.2) {
    // Slightly over budget (20% flex)
    budgetScore = 50;
    reasons.push("Slightly over budget but worth considering");
  } else {
    budgetScore = 0; // Way out of budget
  }
  score += budgetScore * WEIGHTS.BUDGET;

  // 2. Future Growth / Investment (25%)
  const growthScore = user.purpose === "investment" || user.purpose === "rental-income"
    ? colony.investmentScore 
    : colony.futureGrowthScore;
  
  score += growthScore * WEIGHTS.FUTURE_GROWTH;
  if (growthScore > 85) reasons.push("Exceptional future appreciation potential");

  // 3. Family Suitability (15%)
  const familyScore = colony.familyScore;
  score += familyScore * WEIGHTS.FAMILY;
  if (user.purpose === "family-living" && familyScore > 90) {
    reasons.push("Highly recommended for families");
  }

  // 4. Connectivity / Distance (10%)
  let connScore = 50;
  if (colony.trafficCondition === "Low") connScore = 100;
  if (colony.trafficCondition === "Moderate") connScore = 75;
  score += connScore * WEIGHTS.CONNECTIVITY;

  // 5. Builder Trust (10%)
  const trustScore = colony.reraStatus ? 100 : 50;
  score += trustScore * WEIGHTS.BUILDER_TRUST;
  if (colony.reraStatus) reasons.push("RERA Verified & Trusted Builder");

  return {
    colony,
    totalScore: Math.round(score),
    matchReasons: reasons.slice(0, 3)
  };
}

export function rankColonies(colonies: Colony[], userInputs: UserPreferences): RecommendationResult[] {
  const results = colonies.map(c => calculateRecommendationScore(c, userInputs));
  return results
    .filter(r => r.totalScore > 40)
    .sort((a, b) => b.totalScore - a.totalScore);
}
