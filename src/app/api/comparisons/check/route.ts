import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";

export async function GET(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ exists: false });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const area1 = searchParams.get("area1");
    const area2 = searchParams.get("area2");

    if (!area1 || !area2) {
      return NextResponse.json(
        { error: "Missing area1 or area2 query params" },
        { status: 400 }
      );
    }

    const doc = await AreaComparisonModel.findOne({
      $or: [
        { area1, area2 },
        { area1: area2, area2: area1 }
      ]
    })
      .select("slug")
      .lean()
      .exec();

    if (doc) {
      return NextResponse.json({ exists: true, slug: doc.slug });
    }

    return NextResponse.json({ exists: false });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
