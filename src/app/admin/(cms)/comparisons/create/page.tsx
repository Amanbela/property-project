import React from "react";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { ComparisonForm } from "@/components/admin/ComparisonForm";

export default async function CreateComparisonPage() {
  let areas: { _id: string; name: string; slug: string }[] = [];
  if (isMongoConfigured()) {
    try {
      await connectDB();
      areas = await AreaModel.find({ published: true })
        .select("name slug")
        .sort({ name: 1 })
        .lean()
        .then((docs) =>
          docs.map((d) => ({ _id: String(d._id), name: d.name, slug: d.slug }))
        );
    } catch {
      areas = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ComparisonForm areas={areas} />
    </div>
  );
}
