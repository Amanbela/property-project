import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ComparisonHeroProps {
  heroHeading: string;
  introText?: string;
  area1: { name: string; slug: string };
  area2: { name: string; slug: string };
}

export function ComparisonHero({ heroHeading, introText, area1, area2 }: ComparisonHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
      <div className="relative z-10 px-6 py-10 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl max-w-3xl">
          {heroHeading}
        </h1>

        {introText && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {introText}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/areas/${area1.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            {area1.name}
            <ArrowRight size={14} />
          </Link>

          <span className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            vs
          </span>

          <Link
            href={`/areas/${area2.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            {area2.name}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
