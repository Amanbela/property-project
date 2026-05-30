"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category?: string;
  readTimeMinutes?: number;
}

export function BlogCard({ title, excerpt, slug, category, readTimeMinutes }: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card-base group flex flex-col"
    >
      {/* Meta */}
      <div className="mb-3 flex items-center gap-2">
        {category && <span className="badge-blue">{category}</span>}
        {readTimeMinutes && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock size={11} /> {readTimeMinutes} min read
          </span>
        )}
      </div>

      <h3 className="mb-2 font-display font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-body leading-relaxed line-clamp-3 flex-1">{excerpt}</p>

      <Link
        href={`/blog/${slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all"
      >
        Read article <ArrowRight size={14} />
      </Link>
    </motion.article>
  );
}
