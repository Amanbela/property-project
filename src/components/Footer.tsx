import Link from "next/link";
import { Shield, TrendingUp, Compass, MessageSquare } from "lucide-react";

const footerLinks = {
  Explore: [
    { href: "/areas",           label: "Area Intelligence" },
    { href: "/#wizard-section",  label: "Get Recommendations" },
    { href: "/blog",            label: "Market Insights" },
  ],
  "Popular Searches": [
    { href: "/areas",           label: "Best Investment Areas" },
    { href: "/areas",           label: "Budget Friendly Areas" },
    { href: "/areas",           label: "Family-Friendly Areas" },
  ],
  "Top Areas": [
    { href: "/areas/super-corridor", label: "Super Corridor" },
    { href: "/areas/vijay-nagar",    label: "Vijay Nagar" },
    { href: "/areas/rau",            label: "Rau" },
    { href: "/areas/nipania",        label: "Nipania" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-100 bg-slate-50" id="contact">
      {/* Trust strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-main py-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Shield size={16} className="text-trust-600" />
                <span>RERA Verified Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <TrendingUp size={16} className="text-brand-600" />
                <span>AI-Powered Recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Compass size={16} className="text-purple-600" />
                <span>Area-First Intelligence</span>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Indore&apos;s #1 Area Recommendation Platform
            </p>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-main py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-xs font-bold">IP</span>
              <span>Indore Property</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Smart area recommendations for families and investors in Indore. Tell us your budget, we find the right area.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9+]/g, "") || "919999999999"}?text=${encodeURIComponent("Hi, I need property recommendations in Indore.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
              >
                <MessageSquare size={14} />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-600 transition-colors hover:text-brand-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-8 text-xs text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} Indore Property. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="transition-colors hover:text-brand-600">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
