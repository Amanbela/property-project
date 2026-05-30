"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { TrustBadge } from "@/components/ui/TrustBadge";

interface ColonyCardProps {
  colonyName: string;
  slug: string;
  areaName: string;
  investmentScore: number;
  familyScore: number;
  rentalDemand: number;
  averagePlotPrice: number;
  reraStatus?: boolean;
  possessionStatus?: string;
  matchScore?: number;        // from recommendation engine
  matchReasons?: string[];
}

export function ColonyCard({
  colonyName,
  slug,
  areaName,
  investmentScore,
  familyScore,
  rentalDemand,
  averagePlotPrice,
  reraStatus,
  possessionStatus,
  matchScore,
  matchReasons,
}: ColonyCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card-base group flex flex-col"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="badge-slate">
              <MapPin size={10} /> {areaName}
            </span>
            {reraStatus && <TrustBadge variant="rera" />}
            {possessionStatus === "Ready to Move" && (
              <span className="badge bg-trust-50 text-trust-700 ring-1 ring-trust-100">Ready</span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {colonyName}
          </h3>
        </div>

        {matchScore !== undefined && (
          <div className="flex-shrink-0 rounded-xl bg-brand-50 px-3 py-1.5 text-center">
            <p className="text-xs font-medium text-brand-600">Match</p>
            <p className="text-lg font-bold text-brand-700">{matchScore}%</p>
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="mb-4 flex justify-between border-y border-slate-100 py-4">
        <ScoreRing score={investmentScore} size={68} strokeWidth={5} label="Investment" />
        <ScoreRing score={familyScore}     size={68} strokeWidth={5} label="Family" />
        <ScoreRing score={rentalDemand}    size={68} strokeWidth={5} label="Rental" />
      </div>

      {/* Price */}
      <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs text-muted mb-0.5">Avg. Plot Price</p>
        <p className="font-semibold text-slate-900">
          ₹{averagePlotPrice.toLocaleString()}<span className="text-xs font-normal text-muted">/sq.ft</span>
        </p>
      </div>

      {/* Match reasons */}
      {matchReasons && matchReasons.length > 0 && (
        <ul className="mb-4 space-y-1">
          {matchReasons.slice(0, 2).map((r) => (
            <li key={r} className="flex items-start gap-1.5 text-xs text-slate-600">
              <span className="mt-0.5 text-trust-500">✓</span> {r}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        href={`/colonies/${slug}`}
        className="btn-ghost mt-auto w-full justify-center py-2.5 text-xs"
      >
        View Colony Profile <ArrowRight size={13} />
      </Link>
    </motion.article>
  );
}
