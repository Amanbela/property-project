import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";

interface Props {
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  createdAt: string;
  readTimeMinutes: number;
  keywords: string[];
}

export function BlogHero({ title, excerpt, featuredImage, category, createdAt, readTimeMinutes, keywords }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
      {featuredImage && (
        <div className="relative h-56 md:h-72 lg:h-80 overflow-hidden bg-slate-100">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      <div className="px-6 pb-8 -mt-1 relative z-10">
        <div className="flex flex-wrap items-center gap-3 pt-6 pb-4">
          {category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Tag size={11} />
              {category}
            </span>
          )}
          {createdAt && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} />
              {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />
            {readTimeMinutes} min read
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold text-slate-900 leading-tight md:text-3xl lg:text-4xl">
          {title}
        </h1>

        {excerpt && (
          <p className="mt-3 text-base leading-relaxed text-slate-600 max-w-3xl">
            {excerpt}
          </p>
        )}

        {keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
