import React from "react";
import { AgentForm } from "@/components/admin/AgentForm";
import { AgentRepository } from "@/infrastructure/db/repositories/AgentRepository";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAgentPage({ params }: Props) {
  const { id } = await params;
  const agent = await AgentRepository.findById(id);

  if (!agent) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <AgentForm initialData={JSON.parse(JSON.stringify(agent))} isEdit />
    </div>
  );
}
