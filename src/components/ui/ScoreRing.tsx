interface ScoreRingProps {
  score: number;       // 0–100
  size?: number;       // px, default 80
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

function getColor(score: number) {
  if (score >= 80) return { stroke: "#16a34a", text: "text-trust-600", bg: "bg-trust-50" };
  if (score >= 60) return { stroke: "#2563eb", text: "text-brand-600", bg: "bg-brand-50" };
  if (score >= 40) return { stroke: "#d97706", text: "text-amber-600", bg: "bg-amber-50" };
  return { stroke: "#dc2626", text: "text-red-600", bg: "bg-red-50" };
}

export function ScoreRing({ score, size = 80, strokeWidth = 6, label, sublabel }: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const colors = getColor(score);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-slate-800 text-center">{label}</p>}
      {sublabel && <p className="text-xs text-muted text-center">{sublabel}</p>}
    </div>
  );
}
