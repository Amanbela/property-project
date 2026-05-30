import React from "react";
import { ColonyRepository } from "@/infrastructure/db/repositories/ColonyRepository";
import { ColonyListClient } from "./ColonyListClient";

export default async function AdminColoniesPage() {
  const colonies = await ColonyRepository.findAll();

  return (
    <div className="space-y-6">
      <ColonyListClient initialData={JSON.parse(JSON.stringify(colonies))} />
    </div>
  );
}
