"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, Clock, MessageCircle } from "lucide-react";

interface AgentCardProps {
  name: string;
  verifiedStatus: "pending" | "verified" | "rejected";
  rating: number; // 0–5
  experience: number;
  totalDealsClosed: number;
  responseTime: number; // minutes
  specializationAreas: string[];
  companyName?: string;
  bio?: string;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-base font-bold text-white">
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      <span className="ml-1 text-xs text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export function AgentCard({
  name,
  verifiedStatus,
  rating,
  experience,
  totalDealsClosed,
  responseTime,
  specializationAreas,
  companyName,
  bio,
}: AgentCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card-base flex flex-col"
    >
      {/* Profile */}
      <div className="mb-4 flex items-start gap-3">
        <Avatar name={name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-slate-900">{name}</h3>
            {verifiedStatus === "verified" && (
              <CheckCircle2 size={15} className="text-trust-600 flex-shrink-0" aria-label="Verified agent" />
            )}
          </div>
          {companyName && <p className="text-xs text-muted truncate">{companyName}</p>}
          <Stars rating={rating} />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
        <div className="px-3 py-2.5 text-center">
          <p className="text-base font-bold text-slate-900">{experience}y</p>
          <p className="text-xs text-muted">Exp.</p>
        </div>
        <div className="px-3 py-2.5 text-center">
          <p className="text-base font-bold text-slate-900">{totalDealsClosed}</p>
          <p className="text-xs text-muted">Deals</p>
        </div>
        <div className="px-3 py-2.5 text-center">
          <p className="text-base font-bold text-slate-900">{responseTime}m</p>
          <p className="text-xs text-muted">Reply</p>
        </div>
      </div>

      {bio && <p className="mb-4 text-sm text-body line-clamp-2">{bio}</p>}

      {/* Specializations */}
      {specializationAreas.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {specializationAreas.slice(0, 3).map((a) => (
            <span key={a} className="badge-slate">{a}</span>
          ))}
        </div>
      )}

      {/* Contact CTA */}
      <button
        className="btn-primary mt-auto w-full justify-center py-2.5 text-xs"
        aria-label={`Contact ${name}`}
      >
        <MessageCircle size={13} /> Contact Agent
      </button>
    </motion.article>
  );
}
