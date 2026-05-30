import React from "react";
import { LeadRepository } from "@/infrastructure/db/repositories/LeadRepository";
import { LeadListClient } from "./LeadListClient";

export default async function AdminLeadsPage() {
  const leads = await LeadRepository.findAll();

  return (
    <div className="space-y-6">
      <LeadListClient initialData={JSON.parse(JSON.stringify(leads))} />
    </div>
  );
}
