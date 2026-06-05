import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectDB();
    const areas = await AreaModel.find({ published: true })
      .select("name slug")
      .sort({ name: 1 })
      .lean();

    const mapped = areas.map((a) => ({
      _id: String(a._id),
      name: a.name,
      slug: a.slug,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json([]);
  }
}
