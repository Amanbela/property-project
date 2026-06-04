import React from "react";
import { notFound } from "next/navigation";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";
import { ComparisonForm } from "@/components/admin/ComparisonForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditComparisonPage({ params }: Props) {
  const { id } = await params;

  if (!isMongoConfigured()) notFound();
  await connectDB();

  const comparison = await AreaComparisonModel.findById(id)
    .populate("area1", "name slug")
    .populate("area2", "name slug")
    .lean()
    .exec();

  if (!comparison) notFound();

  const areas = await AreaModel.find({ published: true })
    .select("name slug")
    .sort({ name: 1 })
    .lean()
    .then((docs) =>
      docs.map((d) => ({ _id: String(d._id), name: d.name, slug: d.slug }))
    );

  const initialData = JSON.parse(JSON.stringify(comparison));

  return (
    <div className="max-w-6xl mx-auto">
      <ComparisonForm areas={areas} initialData={initialData} isEdit />
    </div>
  );
}
