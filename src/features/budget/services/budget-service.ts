import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";

export async function getActiveBudgetRanges() {
  if (!isMongoConfigured()) return [];

  await connectDB();
  const docs = await BudgetRangeModel.find({ isActive: true })
    .populate("recommendedAreas", "name slug investmentScore familyScore rentalDemand futureGrowth trafficScore averagePricePerSqft")
    .sort({ sortOrder: 1 })
    .lean();

  return docs.map((doc) => ({
    ...doc,
    _id: String(doc._id),
  }));
}

export async function getBudgetRangeBySlug(slug: string) {
  if (!isMongoConfigured()) return null;

  await connectDB();
  const doc = await BudgetRangeModel.findOne({ slug, isActive: true })
    .populate("recommendedAreas")
    .lean();

  if (!doc) return null;

  return {
    ...doc,
    _id: String(doc._id),
  };
}

export async function getBudgetRangeSeo(slug: string) {
  if (!isMongoConfigured()) return null;

  await connectDB();
  const doc = await BudgetRangeModel.findOne({ slug, isActive: true })
    .select("metaTitle metaDescription")
    .lean();

  if (!doc) return null;

  return {
    metaTitle: doc.metaTitle || "",
    metaDescription: doc.metaDescription || "",
  };
}
