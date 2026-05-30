import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ColonyRepository } from "@/infrastructure/db/repositories/ColonyRepository";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { MapPin, ArrowLeft, Phone, TrendingUp, Users, Home, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const colony = await ColonyRepository.findBySlug(slug);
  if (!colony) return { title: "Colony Not Found" };
  return {
    title: `${colony.colonyName} Colony — Investment & Family Analysis | Indore Property`,
    description: `In-depth intelligence report for ${colony.colonyName}, ${colony.areaName}. Investment score ${colony.investmentScore}/100, family score ${colony.familyScore}/100. Verified builders and trusted agents.`,
    openGraph: { title: colony.colonyName, description: colony.description || "" },
  };
}

export default async function ColonyPage({ params }: Props) {
  const { slug } = await params;
  const colony = await ColonyRepository.findBySlug(slug);
  if (!colony) notFound();

  await ColonyRepository.incrementViews(slug);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": colony.colonyName,
    "description": colony.description,
    "address": { "@type": "PostalAddress", "addressLocality": colony.areaName, "addressRegion": "Madhya Pradesh", "addressCountry": "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section-space pb-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="-mb-6">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/colonies" className="hover:text-brand-600">Colonies</Link></li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-800 font-medium">{colony.colonyName}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl bg-slate-900 px-8 py-14 text-white">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/15 blur-[80px]" />
          <div className="relative z-10 max-w-3xl">
            {/* Tags */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
                <MapPin size={11} /> {colony.areaName}
              </span>
              {colony.reraStatus && <TrustBadge variant="rera" size="md" />}
              <span className="badge bg-white/10 text-slate-300 ring-1 ring-white/10">{colony.possessionStatus}</span>
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{colony.colonyName}</h1>
            <p className="max-w-2xl text-slate-300 leading-relaxed">
              {colony.description || "A highly-rated colony tailored for modern living with excellent connectivity and strong future growth potential."}
            </p>
          </div>
        </section>

        {/* Main 2-col layout */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Left/Main ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Intelligence Scores */}
            <section className="card-base">
              <h2 className="heading-md mb-6 border-b border-slate-100 pb-4">Intelligence Scores</h2>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <ScoreRing score={colony.investmentScore} size={90} strokeWidth={6} label="Investment"  sublabel="Growth & ROI" />
                <ScoreRing score={colony.familyScore}     size={90} strokeWidth={6} label="Family"      sublabel="Safety & Schools" />
                <ScoreRing score={colony.rentalDemand}    size={90} strokeWidth={6} label="Rental"      sublabel="Income Potential" />
              </div>
              {colony.futureGrowthScore > 0 && (
                <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4 flex items-center gap-3">
                  <TrendingUp size={20} className="text-brand-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Future Growth Score: {colony.futureGrowthScore}/100</p>
                    <p className="text-xs text-body">Based on infrastructure, connectivity, and area master plans.</p>
                  </div>
                </div>
              )}
            </section>

            {/* Pricing */}
            <section className="card-base">
              <h2 className="heading-md mb-5 border-b border-slate-100 pb-4">Market Pricing</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs font-medium text-muted mb-1">Avg. Plot Price</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ₹{colony.averagePlotPrice.toLocaleString()}
                    <span className="text-sm font-normal text-muted">/sq.ft</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs font-medium text-muted mb-1">Avg. Flat Price</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ₹{colony.averageFlatPrice.toLocaleString()}
                    <span className="text-sm font-normal text-muted">/sq.ft</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Key Details */}
            <section className="card-base">
              <h2 className="heading-md mb-5 border-b border-slate-100 pb-4">Key Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><p className="text-xs text-muted">Possession Status</p><p className="mt-1 font-semibold text-slate-800">{colony.possessionStatus}</p></div>
                <div><p className="text-xs text-muted">Traffic Condition</p><p className="mt-1 font-semibold text-slate-800">{colony.trafficCondition}</p></div>
                {colony.builderName && <div className="sm:col-span-2"><p className="text-xs text-muted">Primary Builder</p><p className="mt-1 font-semibold text-slate-800">{colony.builderName}</p></div>}
              </div>

              {colony.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {colony.amenities.map((a) => (
                      <span key={a} className="badge-slate">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {colony.nearbySchools.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Home size={13} /> Nearby Schools</h3>
                  <div className="flex flex-wrap gap-2">{colony.nearbySchools.map((s) => <span key={s} className="badge-slate">{s}</span>)}</div>
                </div>
              )}
            </section>

            {/* Pros & Cons */}
            {(colony.pros.length > 0 || colony.cons.length > 0) && (
              <section className="card-base">
                <h2 className="heading-md mb-5 border-b border-slate-100 pb-4">Pros & Cons</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {colony.pros.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-trust-600">
                        <CheckCircle2 size={14} /> Advantages
                      </h3>
                      <ul className="space-y-2">
                        {colony.pros.map((p) => <li key={p} className="flex items-start gap-2 text-sm text-body"><span className="mt-1 text-trust-500">•</span>{p}</li>)}
                      </ul>
                    </div>
                  )}
                  {colony.cons.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-red-500">
                        <XCircle size={14} /> Considerations
                      </h3>
                      <ul className="space-y-2">
                        {colony.cons.map((c) => <li key={c} className="flex items-start gap-2 text-sm text-body"><span className="mt-1 text-red-400">•</span>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="space-y-5">

            {/* Contact Expert */}
            <div className="card-base border-2 border-brand-100 bg-brand-50/30">
              <h3 className="heading-md mb-2">Interested in {colony.colonyName}?</h3>
              <p className="mb-5 text-sm text-body">Connect with a verified local expert. Get exclusive site visits and off-market deals.</p>
              <button
                className="btn-primary w-full py-3 justify-center"
                aria-label={`Contact expert for ${colony.colonyName}`}
              >
                <Phone size={15} /> Request a Site Visit
              </button>
              <p className="mt-3 text-center text-xs text-muted">Free service · No hidden charges</p>
            </div>

            {/* Quick stats card */}
            <div className="card-base">
              <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3">Colony Snapshot</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted">RERA Status</span>
                  <span className={`font-semibold ${colony.reraStatus ? "text-trust-600" : "text-slate-400"}`}>
                    {colony.reraStatus ? "✓ Verified" : "Not Listed"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Traffic</span>
                  <span className="font-semibold text-slate-700">{colony.trafficCondition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Investment Score</span>
                  <span className={`font-bold ${colony.investmentScore >= 80 ? "text-trust-600" : "text-brand-600"}`}>{colony.investmentScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Family Score</span>
                  <span className={`font-bold ${colony.familyScore >= 80 ? "text-trust-600" : "text-brand-600"}`}>{colony.familyScore}/100</span>
                </div>
              </div>
            </div>

            {/* Agents CTA */}
            <div className="card-base">
              <div className="mb-3 flex items-center gap-2">
                <Users size={16} className="text-brand-600" />
                <h3 className="font-semibold text-slate-800">Verified Local Agents</h3>
              </div>
              <p className="text-xs text-body mb-4">Background-checked agents who specialize in {colony.areaName}.</p>
              <Link href="/agents" className="btn-ghost w-full justify-center py-2.5 text-xs">
                View Agents <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Back nav */}
        <div>
          <Link href="/colonies" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-600 transition-colors">
            <ArrowLeft size={15} /> Back to All Colonies
          </Link>
        </div>
      </div>
    </>
  );
}
