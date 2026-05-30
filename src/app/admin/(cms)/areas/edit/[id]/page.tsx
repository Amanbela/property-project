import React from "react";
import { AreaForm } from "@/components/admin/AreaForm";
import { AreaRepository } from "@/infrastructure/db/repositories/AreaRepository";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAreaPage({ params }: Props) {
  const { id } = await params;
  const area = await AreaRepository.findById(id);

  if (!area) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <AreaForm initialData={JSON.parse(JSON.stringify(area))} isEdit />
    </div>
  );
}
