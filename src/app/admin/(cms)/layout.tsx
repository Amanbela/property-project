import Link from "next/link";
import { getAdminSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/areas", label: "Areas" },
  { href: "/admin/comparisons", label: "Comparisons" },
  { href: "/admin/colonies", label: "Colonies" },
  { href: "/admin/budget-ranges", label: "Budget Ranges" },
  { href: "/admin/builders", label: "Builders" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/seo-pages", label: "SEO Pages" },
  { href: "/admin/settings", label: "Settings" }
];

export default async function AdminCmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session?.user?.email || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-8">
        <aside className="glass-panel sticky top-20 hidden h-[calc(100vh-5rem)] w-56 shrink-0 flex-col rounded-2xl p-4 md:flex">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">CMS</p>
          <nav className="flex flex-col gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-slate-700 transition hover:bg-white/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-200/80 pt-4 text-xs text-slate-500 dark:border-slate-700">
            <p className="truncate">{session.user.email}</p>
            <Link href="/api/auth/signout?callbackUrl=/" className="mt-2 inline-block text-blue-600 hover:underline">
              Sign out
            </Link>
          </div>
        </aside>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap gap-2 md:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-slate-600">
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
