"use client";

import { AreaSchema } from "@/shared/types/models";
import { createAreaDirect } from "@/actions/admin-areas";
import { AreaForm } from "@/components/admin/AreaForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  name: "Vijay Nagar",
  slug: "vijay-nagar",
  description: "Premium residential area in Indore with excellent connectivity",
  averagePrice: 4500,
  averagePricePerSqft: 4200,
  budgetCategory: ["mid-range", "premium"],
  propertyTypes: ["flat", "villa"],
  investmentScore: 85,
  familyScore: 90,
  rentalDemand: 75,
  futureGrowth: 80,
  trafficScore: 65,
  trafficCondition: 3,
  tags: ["family-friendly", "green-area"],
  lifestyleTags: ["peaceful", "well-connected"],
  connectivity: {
    metroDistanceKm: 2.5,
    airportDistanceKm: 12,
    railwayDistanceKm: 8
  },
  nearbySchools: ["St. Paul School", "Delhi Public School"],
  nearbyHospitals: ["Apollo Hospital", "Medanta"],
  nearbyMalls: ["Phoenix Citadel"],
  nearbyITHubs: ["Infosys Campus"],
  nearbyMetro: true,
  coordinates: { lat: 22.753, lng: 75.893 },
  featuredImage: { imageUrl: "https://example.com/image.jpg", publicId: "" },
  gallery: [],
  pros: ["Good connectivity", "Premium locality"],
  cons: ["Higher property prices"],
  seoTitle: "Vijay Nagar Indore - Premium Residential Area",
  seoDescription: "Complete guide to Vijay Nagar, Indore",
  published: true,
  featured: false
}, null, 2);

export default function CreateAreaPage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<AreaForm />}
      jsonImport={
        <JsonImportTab
          schema={AreaSchema}
          action={createAreaDirect}
          label="Area"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/areas")}
        />
      }
    />
  );
}
