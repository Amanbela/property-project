"use client";

import { motion } from "framer-motion";
import { MessageSquare, MapPin, TrendingUp, Shield, Users, Check, ExternalLink } from "lucide-react";
import Image from "next/image";

export interface SuggestedColony {
  colonyName: string;
  slug: string;
  averagePlotPrice: number;
  averageFlatPrice: number;
  reraStatus: boolean;
}

export interface AreaRecommendationCardProps {
  name: string;
  slug: string;
  description: string;
  featuredImage: string;
  averagePrice: number;
  investmentScore: number;
  familyScore: number;
  futureGrowth: number;
  matchScore: number;
  suggestedColonies: SuggestedColony[];
  whyRecommended: string[];
  budgetLabel: string;
  onWhatsAppClick: (areaName: string) => void;
}

export function AreaRecommendationCard({
  name,
  slug,
  description,
  featuredImage,
  averagePrice,
  investmentScore,
  familyScore,
  futureGrowth,
  matchScore,
  suggestedColonies,
  whyRecommended,
  budgetLabel,
  onWhatsAppClick,
}: AreaRecommendationCardProps) {
  
  // Format WhatsApp message
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919999999999";
  const whatsappMessage = `Hi, I am looking for property in ${name} under ${budgetLabel || "my budget"}. Please share best colony options.`;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-shadow hover:shadow-card-hover flex flex-col md:flex-row gap-6 p-5 md:p-6"
    >
      {/* Area Image */}
      <div className="relative h-48 w-full md:h-auto md:w-56 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={featuredImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback image if unsplash fails
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa";
          }}
        />
        {/* Match Score Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-brand-600/90 backdrop-blur-sm px-3.5 py-1.5 text-center text-white shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-95">Match</p>
          <p className="text-lg font-bold leading-none">{matchScore}%</p>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-2 flex items-start justify-between">
            <div>
              <span className="badge-slate inline-flex items-center gap-1 mb-1 text-xs">
                <MapPin size={12} className="text-slate-400" /> Indore, MP
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 leading-tight">
                {name}
              </h3>
            </div>
            
            {/* Pricing Tag */}
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">Avg Price</span>
              <span className="font-display text-lg font-bold text-slate-800">
                ₹{averagePrice.toLocaleString()}<span className="text-xs font-normal text-muted">/sq.ft</span>
              </span>
            </div>
          </div>

          <p className="text-sm text-body line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Scores Section */}
          <div className="grid grid-cols-3 gap-3 mb-5 border-y border-slate-100 py-3.5">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5">Investment</span>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <TrendingUp size={14} className="text-brand-500" />
                <span className="font-display text-sm font-bold text-slate-800">{investmentScore}/100</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5">Family Score</span>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Shield size={14} className="text-trust-500" />
                <span className="font-display text-sm font-bold text-slate-800">{familyScore}/100</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5">Future Growth</span>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Users size={14} className="text-purple-500" />
                <span className="font-display text-sm font-bold text-slate-800">{futureGrowth}/100</span>
              </div>
            </div>
          </div>

          {/* Colony Suggestions inside card */}
          {suggestedColonies && suggestedColonies.length > 0 && (
            <div className="mb-4 bg-slate-50/50 rounded-2xl p-3.5 border border-slate-100/50">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Popular Colony Suggestions:
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedColonies.map((col) => (
                  <span
                    key={col.slug}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-100 px-3 py-1 text-xs text-slate-700 shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {col.colonyName}
                    {col.reraStatus && (
                      <span className="rounded-md bg-trust-50 px-1 py-0.5 text-[8px] font-bold text-trust-600 ring-1 ring-trust-100">
                        RERA
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Why Recommended Section */}
          {whyRecommended && whyRecommended.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Why Recommended:
              </h4>
              <ul className="space-y-1.5">
                {whyRecommended.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-trust-50 text-trust-600">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* WhatsApp CTA Action */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onWhatsAppClick(name)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 shadow-sm hover:shadow transition-all text-sm leading-none"
          >
            <MessageSquare size={16} fill="white" className="text-emerald-600" />
            Get Property Options on WhatsApp
          </a>
          <a
            href={`/areas/${slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 transition-colors text-sm leading-none"
          >
            Explore Area Profile <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
