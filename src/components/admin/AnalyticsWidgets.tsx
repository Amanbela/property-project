"use client";

import { useEffect, useState } from "react";
import {
  fetchAnalyticsReport,
  fetchFunnelData,
} from "@/actions/admin-analytics";
import {
  TrendingUp,
  MessageSquare,
  Users,
  Eye,
  FileText,
  PhoneCall,
  BarChart3,
} from "lucide-react";

interface AnalyticsSummary {
  totalSessions: number;
  totalPageViews: number;
  totalLeads: number;
  totalWhatsAppClicks: number;
  totalCallClicks: number;
  totalFormSubmissions: number;
  todayLeads: number;
  todayWhatsAppClicks: number;
  todayFormSubmissions: number;
  weeklyLeads: number;
  monthlyLeads: number;
  conversionRate: number;
  leadConversionRate: number;
}

interface FunnelData {
  propertyViews: number;
  whatsappClicks: number;
  formSubmissions: number;
  leadsGenerated: number;
}

export function AnalyticsWidgets() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [reportRes, funnelRes] = await Promise.all([
        fetchAnalyticsReport(),
        fetchFunnelData(),
      ]);
      if (reportRes.ok) setSummary(reportRes.data.summary);
      if (funnelRes.ok) setFunnel(funnelRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="card-base p-8 col-span-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const widgets = [
    {
      label: "Page Views",
      value: summary.totalPageViews.toLocaleString(),
      icon: Eye,
      color: "bg-blue-50 text-blue-600",
      change: `${summary.totalSessions.toLocaleString()} unique sessions`,
    },
    {
      label: "Leads Generated",
      value: summary.totalLeads.toLocaleString(),
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
      change: `${summary.todayLeads} today`,
    },
    {
      label: "WhatsApp Clicks",
      value: summary.totalWhatsAppClicks.toLocaleString(),
      icon: MessageSquare,
      color: "bg-green-50 text-green-600",
      change: `${summary.todayWhatsAppClicks} today`,
    },
    {
      label: "Form Submissions",
      value: summary.totalFormSubmissions.toLocaleString(),
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      change: `${summary.todayFormSubmissions} today`,
    },
    {
      label: "Conversion Rate",
      value: `${summary.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      change: "engagements / page views",
    },
    {
      label: "Lead Conversion",
      value: `${summary.leadConversionRate}%`,
      icon: BarChart3,
      color: "bg-rose-50 text-rose-600",
      change: "leads / engagements",
    },
    {
      label: "Call Clicks",
      value: summary.totalCallClicks.toLocaleString(),
      icon: PhoneCall,
      color: "bg-indigo-50 text-indigo-600",
      change: "total call button clicks",
    },
    {
      label: "Weekly Leads",
      value: summary.weeklyLeads.toLocaleString(),
      icon: TrendingUp,
      color: "bg-cyan-50 text-cyan-600",
      change: `${summary.monthlyLeads.toLocaleString()} this month`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {widgets.map((w) => (
          <div
            key={w.label}
            className="card-base p-4 md:p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${w.color}`}>
                <w.icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {w.label}
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5">
                  {w.value}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400 truncate">{w.change}</p>
          </div>
        ))}
      </div>

      {funnel && (
        <div className="card-base p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-600" />
            Conversion Funnel (Last 30 Days)
          </h3>
          <div className="space-y-3">
            <FunnelBar
              label="Property Views"
              value={funnel.propertyViews}
              max={funnel.propertyViews}
              color="bg-blue-500"
            />
            <FunnelBar
              label="WhatsApp Clicks"
              value={funnel.whatsappClicks}
              max={funnel.propertyViews}
              color="bg-green-500"
            />
            <FunnelBar
              label="Form Submissions"
              value={funnel.formSubmissions}
              max={funnel.propertyViews}
              color="bg-purple-500"
            />
            <FunnelBar
              label="Leads Generated"
              value={funnel.leadsGenerated}
              max={funnel.propertyViews}
              color="bg-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FunnelBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
    </div>
  );
}
