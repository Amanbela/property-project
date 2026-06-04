import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";

const INDEX_POPULATE_FIELDS =
  "name slug description investmentScore familyScore rentalDemand futureGrowth trafficScore averagePricePerSqft averagePrice featuredImage";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectDB();
    const docs = await AreaComparisonModel.find({ isActive: true })
      .populate("area1", INDEX_POPULATE_FIELDS)
      .populate("area2", INDEX_POPULATE_FIELDS)
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
