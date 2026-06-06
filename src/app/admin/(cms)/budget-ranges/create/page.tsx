"use client";

import { BudgetRangeSchema } from "@/shared/types/models";
import { createBudgetRangeDirect } from "@/actions/admin-budget-ranges";
import { BudgetRangeCreateForm } from "@/components/admin/BudgetRangeCreateForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  label: "Under ₹30 Lakh",
  slug: "under-30-lakh",
  minPrice: 0,
  maxPrice: 3000000,
  description: "Best affordable areas in Indore under ₹30 Lakh",
  heroHeading: "Best Areas in Indore Under ₹30 Lakh",
  metaTitle: "Best Areas in Indore Under ₹30 Lakh | Property Guide",
  metaDescription: "Discover the best areas in Indore under ₹30 Lakh. Find top localities with property prices and investment potential.",
  recommendedAreas: [],
  whyThisBudget: "₹30 Lakh is a great starting budget for first-time home buyers in Indore",
  tipForBuyers: "Look for under-construction projects for better deals",
  isActive: true,
  sortOrder: 1
}, null, 2);

export default function CreateBudgetRangePage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<BudgetRangeCreateForm />}
      jsonImport={
        <JsonImportTab
          schema={BudgetRangeSchema}
          action={createBudgetRangeDirect}
          label="Budget Range"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/budget-ranges")}
        />
      }
    />
  );
}
