import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoPageById } from "@/infrastructure/seo/services/seo-page-service";
import { SeoPageEditForm } from "@/components/admin/SeoPageEditForm";

export default async function AdminSeoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getSeoPageById(id);
  if (!page) notFound();

  return (
    <div className="space-y-4">
      <Link href="/admin/seo-pages" className="text-sm text-blue-600">
        ← SEO pages
      </Link>
      <h1 className="text-2xl font-semibold">Edit {page.h1}</h1>
      <SeoPageEditForm page={page} />
    </div>
  );
}
