import { Metadata } from "next";
import { Users, ShieldCheck } from "lucide-react";
import { AgentCard } from "@/components/cards/AgentCard";

export const metadata: Metadata = {
  title: "Verified Property Agents in Indore — Trusted Local Experts",
  description: "Connect with background-checked, verified property agents in Indore. Find local experts by area, rating, and track record.",
};

// Sample data — replace with AgentRepository.findVerifiedAgents() when seeded
const AGENTS = [
  { name: "Rajan Malhotra",   verifiedStatus: "verified" as const, rating: 4.9, experience: 12, totalDealsClosed: 87,  responseTime: 15, specializationAreas: ["Super Corridor", "Rau"], companyName: "Malhotra Realty",    bio: "12 years specializing in Super Corridor plotted developments. 87 successful transactions." },
  { name: "Priya Sharma",     verifiedStatus: "verified" as const, rating: 4.8, experience: 8,  totalDealsClosed: 64,  responseTime: 20, specializationAreas: ["Vijay Nagar", "Nipania"], companyName: "Prime Properties", bio: "Expert in Vijay Nagar and Nipania residential markets. Trusted by 60+ families." },
  { name: "Amit Gupta",       verifiedStatus: "verified" as const, rating: 4.7, experience: 6,  totalDealsClosed: 45,  responseTime: 30, specializationAreas: ["Bypass Road", "Bengali Square"], companyName: "AG Homes",  bio: "Specializing in budget-friendly investments along Bypass Road and Bengali Square." },
  { name: "Sonal Joshi",      verifiedStatus: "verified" as const, rating: 4.6, experience: 5,  totalDealsClosed: 38,  responseTime: 25, specializationAreas: ["Super Corridor"],  companyName: "Joshi & Associates", bio: "Super Corridor's go-to expert for NRI and investment clients." },
  { name: "Rakesh Tiwari",    verifiedStatus: "verified" as const, rating: 4.5, experience: 10, totalDealsClosed: 72,  responseTime: 45, specializationAreas: ["Rau", "AB Road"],   companyName: "Tiwari Estates",     bio: "Decade of experience in Rau township and AB Road commercial investments." },
  { name: "Meera Patel",      verifiedStatus: "pending"  as const, rating: 4.2, experience: 3,  totalDealsClosed: 21,  responseTime: 60, specializationAreas: ["Nipania"],          companyName: "Patel Properties",   bio: "Rising expert in Nipania with strong focus on family-friendly housing." },
];

export default function AgentsPage() {
  const verified = AGENTS.filter((a) => a.verifiedStatus === "verified");
  const pending  = AGENTS.filter((a) => a.verifiedStatus === "pending");

  return (
    <div className="section-space pb-16">

      {/* Hero */}
      <section className="text-center py-6">
        <span className="badge-green mb-4 inline-flex">
          <ShieldCheck size={11} /> Background-Verified Agents Only
        </span>
        <h1 className="heading-xl mb-4 text-slate-900">
          Trusted Local Agents in Indore
        </h1>
        <p className="mx-auto max-w-xl text-body text-base">
          Every agent on this platform has been background-checked and has a verified track record of successful transactions.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-4xl bg-slate-50 p-6 md:px-12">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">{verified.length}</p>
          <p className="text-xs text-muted mt-1">Verified Agents</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-3xl font-bold text-slate-900">{AGENTS.reduce((s, a) => s + a.totalDealsClosed, 0)}+</p>
          <p className="text-xs text-muted mt-1">Deals Closed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">
            {(AGENTS.filter((a) => a.verifiedStatus === "verified").reduce((s, a) => s + a.rating, 0) / verified.length).toFixed(1)}
          </p>
          <p className="text-xs text-muted mt-1">Avg. Rating</p>
        </div>
      </div>

      {/* Verified agents */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <h2 className="heading-lg">Verified Experts</h2>
          <ShieldCheck size={20} className="text-trust-600" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {verified.map((a) => <AgentCard key={a.name} {...a} />)}
        </div>
      </section>

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h2 className="heading-lg mb-6">Verification In Progress</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((a) => <AgentCard key={a.name} {...a} />)}
          </div>
        </section>
      )}

      {/* Agent signup CTA */}
      <section className="card-base border-2 border-brand-100 bg-brand-50/30 text-center py-10">
        <Users size={32} className="mx-auto mb-4 text-brand-600" />
        <h2 className="heading-md mb-2">Are you an agent in Indore?</h2>
        <p className="text-body text-sm mb-6 max-w-md mx-auto">Get verified and listed on Indore Property to connect with high-intent buyers actively looking in your specialization areas.</p>
        <button className="btn-primary mx-auto">Apply to Join</button>
      </section>
    </div>
  );
}
