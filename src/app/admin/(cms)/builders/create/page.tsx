"use client";

import { BuilderSchema } from "@/shared/types/models";
import { createBuilder } from "@/actions/admin-builders";
import { BuilderForm } from "@/components/admin/BuilderForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  builderName: "ABC Constructions",
  completedProjects: 25,
  ongoingProjects: 8,
  reputationScore: 8,
  reraVerified: true,
  reviews: [
    { userName: "Test User", rating: 4, comment: "Good quality construction" }
  ],
  logo: { imageUrl: "https://example.com/logo.png", publicId: "" },
  description: "Leading builder in Indore with 15+ years of experience",
  contactNumber: "+91-9876543210",
  email: "info@abcconstructions.com",
  activeStatus: true,
  curationNotes: "",
  verificationChecklist: {
    identityVerified: false,
    trackRecordVerified: false,
    legalCompliant: false
  }
}, null, 2);

export default function CreateBuilderPage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<BuilderForm />}
      jsonImport={
        <JsonImportTab
          schema={BuilderSchema}
          action={createBuilder}
          label="Builder"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/builders")}
        />
      }
    />
  );
}
