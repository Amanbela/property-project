import Link from "next/link";
import { SeoPageCreateForm } from "@/components/admin/SeoPageCreateForm";

export default function AdminSeoCreatePage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/seo-pages" className="text-sm text-blue-600">
        ← SEO pages
      </Link>
      <h1 className="text-2xl font-semibold">Create SEO page</h1>
      <SeoPageCreateForm />
    </div>
  );
}
