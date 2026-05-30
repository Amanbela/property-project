import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

type BadgeVariant = "verified" | "rera" | "top-rated" | "new-launch";

interface TrustBadgeProps {
  variant: BadgeVariant;
  size?: "sm" | "md";
}

const configs: Record<BadgeVariant, { label: string; className: string; Icon: React.ElementType }> = {
  "verified":    { label: "Verified",    className: "badge-green",    Icon: CheckCircle2 },
  "rera":        { label: "RERA ✓",      className: "badge-blue",     Icon: ShieldCheck },
  "top-rated":   { label: "Top Rated",   className: "badge-amber",    Icon: Star },
  "new-launch":  { label: "New Launch",  className: "badge-slate",    Icon: () => null },
};

export function TrustBadge({ variant, size = "sm" }: TrustBadgeProps) {
  const { label, className, Icon } = configs[variant];
  const iconSize = size === "sm" ? 11 : 13;

  return (
    <span className={`${className} ${size === "md" ? "px-3 py-1.5 text-sm" : ""}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
