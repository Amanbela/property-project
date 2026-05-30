import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectDB();
    const colonies = await ColonyModel.find({ published: true })
      .select("colonyName areaName averagePlotPrice futureGrowthScore")
      .sort({ colonyName: 1 })
      .lean();

    const mapped = colonies.map((c) => ({
      _id: String(c._id),
      colonyName: c.colonyName,
      areaName: c.areaName ?? "",
      averagePlotPrice: c.averagePlotPrice ?? 0,
      futureGrowthScore: c.futureGrowthScore ?? 0,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json([]);
  }
}
