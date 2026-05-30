interface ScoreBarProps {
  score: number;
  label: string;
  sublabel?: string;
  color?: "brand" | "trust" | "amber" | "purple";
}

const colorMap = {
  brand: { bar: "bg-brand-500", track: "bg-brand-100", text: "text-brand-700" },
  trust: { bar: "bg-trust-500", track: "bg-trust-100", text: "text-trust-700" },
  amber: { bar: "bg-amber-500", track: "bg-amber-100", text: "text-amber-700" },
  purple: { bar: "bg-purple-500", track: "bg-purple-100", text: "text-purple-700" },
};

export function ScoreBar({ score, label, sublabel, color = "brand" }: ScoreBarProps) {
  const c = colorMap[color];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className={`text-sm font-bold ${c.text}`}>{score}/100</span>
      </div>
      {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
      <div className={`h-2.5 w-full overflow-hidden rounded-full ${c.track}`}>
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
