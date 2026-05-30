import React from "react";
import Link from "next/link";
import { AreaRepository } from "@/infrastructure/db/repositories/AreaRepository";
import { ColonyRepository } from "@/infrastructure/db/repositories/ColonyRepository";
import { BuilderRepository } from "@/infrastructure/db/repositories/BuilderRepository";
import { AgentRepository } from "@/infrastructure/db/repositories/AgentRepository";
import { LeadRepository } from "@/infrastructure/db/repositories/LeadRepository";
import { countBlogs } from "@/infrastructure/seo/services/blog-service";
import { 
  Building2, 
  MapPin, 
  Users, 
  FileText, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  PlusCircle
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    areaCount,
    colonyCount,
    builderCount,
    agentCount,
    leadCount,
    blogCount
  ] = await Promise.all([
    AreaRepository.count(),
    ColonyRepository.count(),
    BuilderRepository.count(),
    AgentRepository.count(),
    LeadRepository.findAll().then(l => l.length),
    countBlogs()
  ]);

  const stats = [
    { label: "Colonies", count: colonyCount, icon: Building2, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", href: "/admin/colonies" },
    { label: "Areas", count: areaCount, icon: MapPin, color: "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400", href: "/admin/areas" },
    { label: "Builders", count: builderCount, icon: ShieldCheck, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", href: "/admin/builders" },
    { label: "Agents", count: agentCount, icon: Users, color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400", href: "/admin/agents" },
    { label: "Blogs", count: blogCount, icon: FileText, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400", href: "/admin/blogs" },
    { label: "Inbound Leads", count: leadCount, icon: TrendingUp, color: "bg-slate-900 text-white dark:bg-brand-600", href: "/admin/leads" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-800 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Content Intelligence Panel</h1>
          <p className="text-slate-400 text-lg">Manage the data driving Indore&apos;s smartest property decisions. From hyperlocal colony insights to builder trust scores.</p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <Link 
              href="/admin/colonies/create" 
              className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm"
            >
              <PlusCircle size={18} /> New Colony
            </Link>
            <Link 
              href="/admin/blogs/create" 
              className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold hover:bg-white/20 transition-all text-sm backdrop-blur-sm"
            >
              <FileText size={18} /> Draft Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            className="group card-base p-6 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300 border-2 border-transparent hover:border-slate-100 dark:hover:border-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors" size={20} />
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stat.count}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-base p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-600" /> Recent Inquiries
          </h2>
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Dashboard provides real-time visibility into incoming leads and interest trends.</p>
            <Link 
              href="/admin/leads" 
              className="block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Review Inbound Traffic</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Check status and contact preferences</p>
                </div>
                <div className="bg-white dark:bg-slate-700 p-2 rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card-base p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-600" /> Maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/seo-pages" className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
              <p className="font-bold text-sm dark:text-slate-200">SEO Overlays</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage global meta tags</p>
            </Link>
            <Link href="/admin/settings" className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
              <p className="font-bold text-sm dark:text-slate-200">Platform Settings</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Global constants & configs</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
