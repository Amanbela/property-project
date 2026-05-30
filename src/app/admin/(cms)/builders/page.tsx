import React from "react";
import { BuilderRepository } from "@/infrastructure/db/repositories/BuilderRepository";
import { BuilderListClient } from "./BuilderListClient";

export default async function AdminBuildersPage() {
  const builders = await BuilderRepository.findAll();

  return (
    <div className="space-y-6">
      <BuilderListClient initialData={JSON.parse(JSON.stringify(builders))} />
    </div>
  );
}
