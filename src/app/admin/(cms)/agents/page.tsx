import React from "react";
import { AgentRepository } from "@/infrastructure/db/repositories/AgentRepository";
import { AgentListClient } from "./AgentListClient";

export default async function AdminAgentsPage() {
  const agents = await AgentRepository.findAll();

  return (
    <div className="space-y-6">
      <AgentListClient initialData={JSON.parse(JSON.stringify(agents))} />
    </div>
  );
}
