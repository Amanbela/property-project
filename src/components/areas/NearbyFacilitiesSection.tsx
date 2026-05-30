import { School, Hospital, ShoppingBag, Building2, Train, Bus } from "lucide-react";

interface NearbyFacilitiesSectionProps {
  schools: string[];
  hospitals: string[];
  malls?: string[];
  itHubs?: string[];
  nearbyMetro: boolean;
  connectivity?: {
    metroDistanceKm: number;
    airportDistanceKm: number;
    railwayDistanceKm: number;
  };
}

interface FacilityGroup {
  icon: typeof School;
  title: string;
  items: string[];
  color: string;
  iconColor: string;
}

export function NearbyFacilitiesSection({
  schools,
  hospitals,
  malls,
  itHubs,
  nearbyMetro,
  connectivity,
}: NearbyFacilitiesSectionProps) {
  const groups: FacilityGroup[] = [
    {
      icon: School,
      title: "Schools & Education",
      items: schools,
      color: "border-sky-200 bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      icon: Hospital,
      title: "Hospitals & Healthcare",
      items: hospitals,
      color: "border-red-200 bg-red-50",
      iconColor: "text-red-600",
    },
    ...(malls && malls.length > 0
      ? [
          {
            icon: ShoppingBag as typeof School,
            title: "Malls & Shopping",
            items: malls,
            color: "border-purple-200 bg-purple-50",
            iconColor: "text-purple-600",
          },
        ]
      : []),
    ...(itHubs && itHubs.length > 0
      ? [
          {
            icon: Building2 as typeof School,
            title: "IT Hubs & Business",
            items: itHubs,
            color: "border-brand-200 bg-brand-50",
            iconColor: "text-brand-600",
          },
        ]
      : []),
  ];

  return (
    <section>
      <h2 className="heading-md mb-6 text-slate-900">Nearby Facilities & Connectivity</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className={`rounded-2xl border ${group.color} p-5`}>
              <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className={group.iconColor} />
                <h3 className="font-display text-sm font-bold text-slate-800">{group.title}</h3>
              </div>
              {group.items.length > 0 ? (
                <ul className="space-y-1.5">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Information coming soon</p>
              )}
            </div>
          );
        })}

        {/* Connectivity Card */}
        {(nearbyMetro || connectivity) && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bus size={18} className="text-emerald-600" />
              <h3 className="font-display text-sm font-bold text-slate-800">Connectivity</h3>
            </div>
            <ul className="space-y-2">
              {nearbyMetro && (
                <li className="flex items-center gap-2 text-sm text-emerald-700">
                  <Train size={14} />
                  <span className="font-medium">Metro connectivity available</span>
                </li>
              )}
              {connectivity?.metroDistanceKm ? (
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  Metro: {connectivity.metroDistanceKm} km
                </li>
              ) : null}
              {connectivity?.airportDistanceKm ? (
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  Airport: {connectivity.airportDistanceKm} km
                </li>
              ) : null}
              {connectivity?.railwayDistanceKm ? (
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  Railway: {connectivity.railwayDistanceKm} km
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
