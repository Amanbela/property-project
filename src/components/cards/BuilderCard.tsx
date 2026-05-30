"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Building2, Star, ShieldCheck } from "lucide-react";

interface BuilderCardProps {
  builderName: string;
  completedProjects: number;
  ongoingProjects: number;
  reputationScore: number; // 0–10
  reraVerified: boolean;
  description?: string;
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round(score / 2); // convert 0-10 to 0-5
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-slate-500">{score.toFixed(1)}/10</span>
    </div>
  );
}

export function BuilderCard({
  builderName,
  completedProjects,
  ongoingProjects,
  reputationScore,
  reraVerified,
  description,
}: BuilderCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card-base flex flex-col"
    >
      {/* Header with logo placeholder */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50">
          <Building2 size={24} className="text-brand-600" />
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-900">{builderName}</h3>
          <StarRating score={reputationScore} />
        </div>
      </div>

      {/* Trust indicator */}
      {reraVerified && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-trust-50 px-3 py-2">
          <ShieldCheck size={14} className="text-trust-600" />
          <span className="text-xs font-semibold text-trust-700">RERA Registered & Verified</span>
        </div>
      )}

      {description && (
        <p className="mb-4 text-sm text-body line-clamp-2">{description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
        <div>
          <p className="text-2xl font-bold text-slate-900">{completedProjects}</p>
          <p className="text-xs text-muted">Projects Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-brand-600">{ongoingProjects}</p>
          <p className="text-xs text-muted">Ongoing Projects</p>
        </div>
      </div>
    </motion.article>
  );
}
