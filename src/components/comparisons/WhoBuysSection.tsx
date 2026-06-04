import { Users } from "lucide-react";

interface WhoBuysHere {
  area1Profile?: string;
  area2Profile?: string;
}

interface WhoBuysSectionProps {
  whoBuysHere?: WhoBuysHere | null;
  area1Name: string;
  area2Name: string;
}

export function WhoBuysSection({ whoBuysHere, area1Name, area2Name }: WhoBuysSectionProps) {
  if (!whoBuysHere || (!whoBuysHere.area1Profile && !whoBuysHere.area2Profile)) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
          <Users size={18} className="text-purple-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">Who Should Buy Here?</h2>
          <p className="text-sm text-slate-500">Ideal buyer profiles for each area</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {whoBuysHere.area1Profile && (
          <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
            <h3 className="font-display text-lg font-bold text-brand-900">{area1Name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{whoBuysHere.area1Profile}</p>
          </div>
        )}
        {whoBuysHere.area2Profile && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <h3 className="font-display text-lg font-bold text-blue-900">{area2Name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{whoBuysHere.area2Profile}</p>
          </div>
        )}
      </div>
    </section>
  );
}
