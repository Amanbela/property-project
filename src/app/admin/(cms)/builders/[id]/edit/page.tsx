import React from "react";
import { BuilderForm } from "@/components/admin/BuilderForm";
import { BuilderRepository } from "@/infrastructure/db/repositories/BuilderRepository";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBuilderPage({ params }: Props) {
  const { id } = await params;
  const builder = await BuilderRepository.findById(id);

  if (!builder) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <BuilderForm initialData={JSON.parse(JSON.stringify(builder))} isEdit />
    </div>
  );
}
