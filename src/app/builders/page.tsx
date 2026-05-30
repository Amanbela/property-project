import { Metadata } from "next";
import { ShieldCheck, Building2, TrendingUp } from "lucide-react";
import { BuilderCard } from "@/components/cards/BuilderCard";

export const metadata: Metadata = {
  title: "Verified Builders in Indore — RERA Registered Developers",
  description: "Browse RERA-verified builders and developers in Indore. Check reputation scores, completed projects, and trust indicators before investing.",
};

// Sample data — replace with BuilderRepository.findAllActive() when seeded
const BUILDERS = [
  { builderName: "Mahindra Lifespaces",   completedProjects: 22, ongoingProjects: 4, reputationScore: 9.2, reraVerified: true,  description: "One of India's most trusted developers with 25+ years of delivering premium residential projects." },
  { builderName: "Omaxe Developers",      completedProjects: 18, ongoingProjects: 6, reputationScore: 8.5, reraVerified: true,  description: "Known for affordable housing with strong infrastructure and on-time delivery track record." },
  { builderName: "Prestige Group",        completedProjects: 35, ongoingProjects: 8, reputationScore: 9.5, reraVerified: true,  description: "Premium luxury developer with RERA compliance and exceptional amenities across all projects." },
  { builderName: "Anil Sood Builders",    completedProjects: 7,  ongoingProjects: 2, reputationScore: 7.8, reraVerified: false, description: "Local Indore developer with strong footprint in Super Corridor and Rau township developments." },
  { builderName: "Ratan Developers",      completedProjects: 12, ongoingProjects: 3, reputationScore: 8.1, reraVerified: true,  description: "Specializes in mid-range residential plots and villas across emerging Indore localities." },
  { builderName: "Vista Homes",           completedProjects: 5,  ongoingProjects: 4, reputationScore: 7.5, reraVerified: true,  description: "New-age developer focused on sustainable residential communities in North Indore." },
];

export default function BuildersPage() {
  const verified = BUILDERS.filter((b) => b.reraVerified);
  const others   = BUILDERS.filter((b) => !b.reraVerified);

  return (
    <div className="section-space pb-16">

      {/* Hero */}
      <section className="text-center py-6">
        <span className="badge-green mb-4 inline-flex">
          <ShieldCheck size={11} /> All Builders Independently Verified
        </span>
        <h1 className="heading-xl mb-4 text-slate-900">
          Verified Builders in Indore
        </h1>
        <p className="mx-auto max-w-xl text-body text-base">
          We analyze RERA filings, delivery track records, and buyer reviews so you invest only with developers who have earned trust.
        </p>
      </section>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 rounded-4xl bg-slate-50 p-6 md:px-12">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">{verified.length}</p>
          <p className="text-xs text-muted mt-1">RERA Verified</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-3xl font-bold text-slate-900">{BUILDERS.reduce((s, b) => s + b.completedProjects, 0)}+</p>
          <p className="text-xs text-muted mt-1">Projects Completed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">{BUILDERS.reduce((s, b) => s + b.ongoingProjects, 0)}</p>
          <p className="text-xs text-muted mt-1">Ongoing Projects</p>
        </div>
      </div>

      {/* Verified section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <h2 className="heading-lg">RERA Verified Builders</h2>
          <ShieldCheck size={20} className="text-trust-600" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {verified.map((b) => <BuilderCard key={b.builderName} {...b} />)}
        </div>
      </section>

      {/* Other builders */}
      {others.length > 0 && (
        <section>
          <h2 className="heading-lg mb-6">Other Active Builders</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((b) => <BuilderCard key={b.builderName} {...b} />)}
          </div>
        </section>
      )}

      {/* Trust CTA */}
      <section className="card-base border-2 border-brand-100 bg-brand-50/30 text-center py-10">
        <Building2 size={32} className="mx-auto mb-4 text-brand-600" />
        <h2 className="heading-md mb-2">Are you a builder?</h2>
        <p className="text-body text-sm mb-6 max-w-md mx-auto">Get your RERA profile verified and listed on Indore Property to connect with qualified buyers.</p>
        <button className="btn-primary mx-auto">Apply for Verification</button>
      </section>
    </div>
  );
}
