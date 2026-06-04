import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const { slug } = await params;
    const doc = await AreaComparisonModel.findOne({ slug })
      .populate("area1")
      .populate("area2")
      .lean()
      .exec();

    if (!doc || !doc.isActive) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
