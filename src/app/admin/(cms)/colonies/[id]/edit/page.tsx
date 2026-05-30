import React from "react";
import { ColonyForm } from "@/components/admin/ColonyForm";
import { ColonyRepository } from "@/infrastructure/db/repositories/ColonyRepository";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditColonyPage({ params }: Props) {
  const { id } = await params;
  const colony = await ColonyRepository.findById(id);

  if (!colony) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <ColonyForm initialData={JSON.parse(JSON.stringify(colony))} isEdit />
    </div>
  );
}
