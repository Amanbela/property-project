import Link from "next/link";
import { ChevronRight, Shield, TrendingUp, Compass, ArrowRight, Target, Sparkles } from "lucide-react";
import { getPublishedBlogs } from "@/infrastructure/seo/services/blog-service";
import { BlogCard } from "@/components/cards/BlogCard";
import { RecommendationWizard } from "@/features/recommendations/components/RecommendationWizard";
import { HomepageAreaCard } from "@/components/areas/HomepageAreaCard";
import { getTopInvestmentAreas, getTopFamilyAreas, getTopGrowthAreas } from "@/features/colony-intelligence/services/area-service";

const HOW_IT_WORKS = [
  { step: "01", title: "Set Your Budget & Goals", desc: "Tell us your budget range, property type, and purpose — no browsing required.", color: "bg-brand-50 text-brand-600", icon: Target },
  { step: "02", title: "AI Area Intelligence", desc: "Our engine scores 50+ areas using growth trends, rental data, and family ratings.", color: "bg-trust-50 text-trust-600", icon: Sparkles },
  { step: "03", title: "Get Matched & Connect", desc: "Receive personalized area recommendations with WhatsApp lead connect in one click.", color: "bg-purple-50 text-purple-600", icon: Compass },
];

const FAQS = [
  { q: "How is this different from MagicBricks or 99acres?",    a: "We don't show thousands of listings. You set your budget and goals, and we recommend the best areas with AI-scored intelligence — not a generic listing portal." },
  { q: "Are the area scores based on real data?",               a: "Yes — scores use RERA filings, rental demand analysis, school/hospital proximity, infrastructure pipeline, and traffic data for each area in Indore." },
  { q: "How do I get property options in a recommended area?",  a: "Each area page has a WhatsApp CTA and lead form. Share your budget and we connect you with verified options — no platform fee." },
  { q: "Is this platform free to use?",                         a: "Completely free for property seekers. We generate leads for verified builders and agents — you pay nothing." },
];

export default async function HomePage() {
  const [blogs, topInvestment, topFamily, topGrowth] = await Promise.all([
    getPublishedBlogs(6),
    getTopInvestmentAreas(3),
    getTopFamilyAreas(3),
    getTopGrowthAreas(3),
  ]);

  return (
    <div className="section-space pb-16">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="py-8 text-center md:py-14">
        <div className="mx-auto max-w-3xl">
          <span className="badge-blue mb-5 inline-flex">
            <Shield size={11} /> AI-Powered Area Recommendation Platform
          </span>
          <h1 className="heading-xl mb-5 text-slate-900">
            Find the Best Area in Indore —{" "}
            <span className="text-brand-600">Based on Your Budget</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-body md:text-lg">
            Skip the listings. Tell us your budget and goals. Our intelligence engine matches
            you with the right area, investment score, and colony options — in under 2 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#wizard-section" className="btn-primary px-7 py-3">
              Start Your Search <ChevronRight size={16} />
            </a>
            <Link href="/areas" className="btn-outline">
              Explore Area Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recommendation Wizard ─────────────────────────── */}
      <section className="scroll-mt-20" id="wizard-section">
        <RecommendationWizard />
      </section>

      {/* ── How it Works ──────────────────────────────────── */}
      <section className="bg-slate-50 rounded-4xl px-6 py-12 md:px-12">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="heading-lg mb-3">How Area Recommendations Work</h2>
          <p className="text-body">Three steps from your budget to your ideal area in Indore.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, title, desc, color, icon: Icon }) => (
            <div key={step} className="relative card-base">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="heading-md mb-2">{title}</h3>
              <p className="text-sm text-body">{desc}</p>
              {step !== "03" && (
                <ArrowRight size={18} className="absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Investment Areas ──────────────────────────── */}
      {topInvestment.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="heading-lg">Best Areas for Investment</h2>
              <p className="mt-1 text-body text-sm">Highest scoring areas for long-term ROI and appreciation.</p>
            </div>
            <Link href="/areas" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline md:flex">
              View All Areas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topInvestment.map((area) => (
              <HomepageAreaCard key={area.slug} area={area} badge="Top Investment" badgeColor="bg-brand-600" />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/areas" className="btn-outline">View All Areas</Link>
          </div>
        </section>
      )}

      {/* ── Fast Growing Areas ────────────────────────────── */}
      {topGrowth.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="heading-lg">Fastest Growing Areas</h2>
              <p className="mt-1 text-body text-sm">High future growth potential with upcoming infrastructure.</p>
            </div>
            <Link href="/areas" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline md:flex">
              View All Areas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topGrowth.map((area) => (
              <HomepageAreaCard key={area.slug} area={area} badge="High Growth" badgeColor="bg-purple-600" />
            ))}
          </div>
        </section>
      )}

      {/* ── Family Friendly Areas ─────────────────────────── */}
      {topFamily.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="heading-lg">Family-Friendly Areas</h2>
              <p className="mt-1 text-body text-sm">Top-rated areas for community living, schools, and safety.</p>
            </div>
            <Link href="/areas" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline md:flex">
              View All Areas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topFamily.map((area) => (
              <HomepageAreaCard key={area.slug} area={area} badge="Family Friendly" badgeColor="bg-trust-600" />
            ))}
          </div>
        </section>
      )}

      {/* ── Market Insights ───────────────────────────────── */}
      {blogs.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="heading-lg">Market Insights</h2>
              <p className="mt-1 text-body text-sm">Data-driven analysis for smart area decisions.</p>
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline md:flex">
              All Articles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((b) => (
              <BlogCard key={b.slug} title={b.title} excerpt={b.excerpt} slug={b.slug} />
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl">
        <h2 className="heading-lg mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="card-base group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-slate-800 list-none text-sm md:text-base">
                {q}
                <ChevronRight size={16} className="flex-shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-body border-t border-slate-100 pt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-4xl bg-slate-900 px-8 py-14 text-center text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative">
          <h2 className="heading-lg mb-3">Ready to Find Your Ideal Area?</h2>
          <p className="mx-auto mb-8 max-w-lg text-sm text-slate-300">
            Skip the listings. Get AI-powered area recommendations based on your budget and goals — in under 2 minutes.
          </p>
          <a href="#wizard-section" className="btn-primary bg-white !text-brand-700 hover:!bg-slate-100 hover:!shadow-none px-8 py-3">
            Find My Area <ChevronRight size={16} />
          </a>
        </div>
      </section>

    </div>
  );
}
