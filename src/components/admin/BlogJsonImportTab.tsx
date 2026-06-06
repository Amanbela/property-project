"use client";

import { useRouter } from "next/navigation";
import { BlogSchema } from "@/shared/types/models";
import { createBlog } from "@/actions/admin-blogs";
import { JsonImportTab } from "./JsonImportTab";

const exampleJson = JSON.stringify({
  title: "Indore Mein 50 Lakh Mein Ghar Kahan Khareedein?",
  excerpt: "Budget friendly areas in Indore under 50 lakh.",
  content: "<!-- Your markdown or HTML content here -->",
  category: "Property Insight",
  seoTitle: "Indore Mein 50 Lakh Mein Ghar Kahan Khareedein?",
  seoDescription: "Best areas in Indore under 50 lakh budget.",
  keywords: ["indore property", "50 lakh house", "budget homes indore"],
  schemaType: "Article",
  status: "published",
  relatedSlugs: ["area-guide-indore", "best-localities-indore"],
  faqs: [
    { question: "Is ₹50 lakh enough for a house in Indore?", answer: "Yes, there are several affordable localities." }
  ]
}, null, 2);

export function BlogJsonImportTab() {
  const router = useRouter();

  return (
    <JsonImportTab
      schema={BlogSchema}
      action={createBlog}
      label="Blog"
      exampleJson={exampleJson}
      onSuccess={() => router.push("/admin/blogs")}
    />
  );
}
