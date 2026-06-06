"use client";

import { AgentSchema } from "@/shared/types/models";
import { createAgent } from "@/actions/admin-agents";
import { AgentForm } from "@/components/admin/AgentForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  name: "Rahul Sharma",
  phone: "9876543210",
  verifiedStatus: "pending",
  specializationAreas: ["Vijay Nagar", "Super Corridor"],
  colonyCoverage: [],
  experience: 8,
  rating: 4.5,
  responseTime: 15,
  profileImage: { imageUrl: "https://example.com/photo.jpg", publicId: "" },
  companyName: "Property Solutions Inc.",
  totalDealsClosed: 120,
  activeStatus: true,
  bio: "Experienced real estate agent specializing in residential properties in Indore.",
  curationNotes: "",
  verificationChecklist: {
    identityVerified: false,
    reraRegistered: false,
    experienceVerified: false
  }
}, null, 2);

export default function CreateAgentPage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<AgentForm />}
      jsonImport={
        <JsonImportTab
          schema={AgentSchema}
          action={createAgent}
          label="Agent"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/agents")}
        />
      }
    />
  );
}
