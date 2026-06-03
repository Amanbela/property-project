import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectDB();
    const ranges = await BudgetRangeModel.find({ isActive: true })
      .populate("recommendedAreas", "name slug investmentScore familyScore rentalDemand futureGrowth trafficScore averagePricePerSqft")
      .sort({ sortOrder: 1 })
      .lean();

    const mapped = ranges.map((r) => ({
      ...r,
      _id: String(r._id),
      recommendedAreas: (r.recommendedAreas ?? []).map((a: unknown) => {
        const area = a as Record<string, unknown>;
        return {
          _id: String(area._id),
          name: area.name ?? "",
          slug: area.slug ?? "",
          investmentScore: area.investmentScore ?? 0,
          familyScore: area.familyScore ?? 0,
          rentalDemand: area.rentalDemand ?? 0,
          futureGrowth: area.futureGrowth ?? 0,
          trafficScore: area.trafficScore ?? 0,
          averagePricePerSqft: area.averagePricePerSqft ?? 0,
        };
      }),
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json([]);
  }
}
