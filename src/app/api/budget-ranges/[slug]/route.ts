import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    await connectDB();
    const range = await BudgetRangeModel.findOne({ slug })
      .populate("recommendedAreas")
      .lean();

    if (!range) {
      return NextResponse.json({ error: "Budget range not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...range,
      _id: String(range._id),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch budget range" }, { status: 500 });
  }
}
