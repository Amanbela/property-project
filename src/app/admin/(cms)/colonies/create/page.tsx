"use client";

import { ColonySchema } from "@/shared/types/models";
import { createColony } from "@/actions/admin-colonies";
import { ColonyForm } from "@/components/admin/ColonyForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  colonyName: "Shalimar Township",
  slug: "shalimar-township",
  areaId: "AREA_OBJECT_ID_HERE",
  averagePlotPrice: 3500,
  averageFlatPrice: 4200,
  builderName: "Shalimar Corp",
  possessionStatus: "Ready to Move",
  amenities: ["Swimming Pool", "Club House", "Park"],
  nearbySchools: ["Delhi Public School"],
  nearbyHospitals: ["Apollo Hospital"],
  futureGrowthScore: 80,
  investmentScore: 75,
  familyScore: 85,
  rentalDemand: 70,
  trafficCondition: "Moderate",
  legalApprovalStatus: "Approved",
  reraStatus: true,
  pros: ["Gated community", "Good amenities"],
  cons: ["Slightly far from city center"],
  description: "Premium gated township in Indore",
  geoLocation: { lat: 22.753, lng: 75.893 },
  images: [],
  faqs: [
    { question: "What is the price range?", answer: "Starting from ₹35 Lakh" }
  ],
  verificationChecklist: {
    legalApproved: true,
    reraApproved: true,
    possessionVerified: false
  },
  published: true
}, null, 2);

export default function CreateColonyPage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<ColonyForm />}
      jsonImport={
        <JsonImportTab
          schema={ColonySchema}
          action={createColony}
          label="Colony"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/colonies")}
        />
      }
    />
  );
}
