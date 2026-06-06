"use client";

import { SeoPageImportSchema } from "@/shared/types/models";
import { createSeoPageDirect } from "@/actions/admin-seo-pages";
import { SeoPageCreateForm } from "@/components/admin/SeoPageCreateForm";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";
import { JsonImportTab } from "@/components/admin/JsonImportTab";
import { useRouter } from "next/navigation";

const exampleJson = JSON.stringify({
  slug: "indore-property-guide-2024",
  seoTitle: "Complete Indore Property Guide 2024 | AreaMatch",
  metaDescription: "Your complete guide to buying property in Indore. Compare areas, budgets, and find the best locality for your needs.",
  keyword: "indore property guide",
  h1: "Indore Property Guide 2024",
  intro: "Find the perfect property in Indore with our comprehensive guide covering all major areas and budgets.",
  sections: [
    { heading: "Overview", content: "Indore has seen remarkable growth in real estate over the past decade." },
    { heading: "Popular Areas", content: "Vijay Nagar, Super Corridor, and Scheme 140 are among the most sought-after localities." }
  ],
  faqs: [
    { q: "What is the average property price in Indore?", a: "Property prices in Indore range from ₹2,500 to ₹6,000 per sq.ft." }
  ],
  published: true,
  articleSchemaJson: "",
  faqSchemaJson: ""
}, null, 2);

const isSchema = SeoPageImportSchema as unknown as {
  safeParse: (data: unknown) => { success: boolean; error?: { flatten: () => { fieldErrors: Record<string, string[]> }; message?: string }; data?: unknown };
};

export default function AdminSeoCreatePage() {
  const router = useRouter();

  return (
    <CreatePageTabs
      formEntry={<SeoPageCreateForm />}
      jsonImport={
        <JsonImportTab
          schema={isSchema}
          action={createSeoPageDirect}
          label="SEO Page"
          exampleJson={exampleJson}
          onSuccess={() => router.push("/admin/seo-pages")}
        />
      }
    />
  );
}
