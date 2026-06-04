import { Award } from "lucide-react";

interface VerdictSectionProps {
  verdict?: string | null;
}

export function VerdictSection({ verdict }: VerdictSectionProps) {
  if (!verdict) return null;

  return (
    <section className="rounded-2xl border-l-4 border-brand-500 bg-gradient-to-r from-brand-50 to-white p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
          <Award size={20} className="text-brand-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">Our Verdict</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-700 md:text-lg">
            {verdict}
          </p>
        </div>
      </div>
    </section>
  );
}
