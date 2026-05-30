import { connectForWrites } from "@/infrastructure/db/connection";
import { LeadEventModel } from "@/features/analytics/models/LeadEvent";
import { UserSessionModel } from "@/features/analytics/models/UserSession";
import { LeadModel } from "@/features/lead-engine/models/Lead";

export interface AnalyticsSummary {
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

export interface TopItem {
  id: string;
  name: string;
  count: number;
}

export interface AnalyticsReport {
  summary: AnalyticsSummary;
  topProperties: TopItem[];
  topColonies: TopItem[];
  topAreas: TopItem[];
  recentEvents: {
    eventType: string;
    areaName: string;
    timestamp: Date;
  }[];
}

function startOfDay(daysAgo = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAnalyticsReport(): Promise<AnalyticsReport> {
  await connectForWrites();

  const now = new Date();
  const todayStart = startOfDay(0);
  const weekStart = startOfDay(7);
  const monthStart = startOfDay(30);

  const [
    totalSessions,
    totalPageViews,
    totalLeads,
    totalWhatsAppClicks,
    totalCallClicks,
    totalFormSubmissions,
    todayLeads,
    todayWhatsAppClicks,
    todayFormSubmissions,
    weeklyLeads,
    monthlyLeads,
    topProperties,
    topColonies,
    topAreas,
    recentEvents,
  ] = await Promise.all([
    UserSessionModel.countDocuments(),
    UserSessionModel.aggregate([
      { $group: { _id: null, total: { $sum: "$pageViews" } } },
    ]).then((r) => (r[0]?.total ?? 0)),
    LeadModel.countDocuments(),
    LeadEventModel.countDocuments({ eventType: "whatsapp_clicked" }),
    LeadEventModel.countDocuments({ eventType: "call_clicked" }),
    LeadEventModel.countDocuments({ eventType: "contact_form_submitted" }),
    LeadModel.countDocuments({ createdAt: { $gte: todayStart } }),
    LeadEventModel.countDocuments({
      eventType: "whatsapp_clicked",
      timestamp: { $gte: todayStart },
    }),
    LeadEventModel.countDocuments({
      eventType: "contact_form_submitted",
      timestamp: { $gte: todayStart },
    }),
    LeadModel.countDocuments({ createdAt: { $gte: weekStart } }),
    LeadModel.countDocuments({ createdAt: { $gte: monthStart } }),
    LeadEventModel.aggregate<TopItem>([
      { $match: { eventType: "property_viewed" } },
      {
        $group: {
          _id: "$properties.propertyId",
          name: { $first: "$properties.areaName" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: { $ifNull: ["$name", "Unknown"] },
          count: 1,
        },
      },
    ]),
    LeadEventModel.aggregate<TopItem>([
      { $match: { eventType: "colony_viewed" } },
      {
        $group: {
          _id: "$properties.colonyId",
          name: { $first: "$properties.colonyName" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: { $ifNull: ["$name", "Unknown"] },
          count: 1,
        },
      },
    ]),
    LeadEventModel.aggregate<TopItem>([
      { $match: { eventType: "whatsapp_clicked" } },
      {
        $group: {
          _id: "$properties.areaName",
          name: { $first: "$properties.areaName" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: { $ifNull: ["$name", "Unknown"] },
          count: 1,
        },
      },
    ]),
    LeadEventModel.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .select("eventType properties.timestamp")
      .lean()
      .then((docs) =>
        docs.map((d) => ({
          eventType: d.eventType,
          areaName: (d.properties as { areaName?: string })?.areaName || "",
          timestamp: d.timestamp as Date,
        }))
      ),
  ]);

  const conversionRate =
    totalPageViews > 0
      ? Math.round(((totalWhatsAppClicks + totalFormSubmissions) / totalPageViews) * 10000) / 100
      : 0;

  const leadConversionRate =
    totalWhatsAppClicks + totalFormSubmissions > 0
      ? Math.round(
          (totalLeads / (totalWhatsAppClicks + totalFormSubmissions)) * 10000
        ) / 100
      : 0;

  return {
    summary: {
      totalSessions,
      totalPageViews,
      totalLeads,
      totalWhatsAppClicks,
      totalCallClicks,
      totalFormSubmissions,
      todayLeads,
      todayWhatsAppClicks,
      todayFormSubmissions,
      weeklyLeads,
      monthlyLeads,
      conversionRate,
      leadConversionRate,
    },
    topProperties,
    topColonies,
    topAreas,
    recentEvents,
  };
}

export async function getFunnelData() {
  await connectForWrites();

  const now = new Date();
  const days = 30;
  const start = startOfDay(days);

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: start },
        eventType: {
          $in: [
            "property_viewed",
            "whatsapp_clicked",
            "contact_form_submitted",
            "lead_generated",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$eventType",
        count: { $sum: 1 },
      },
    },
  ];

  const results = await LeadEventModel.aggregate(pipeline);
  const map = new Map(results.map((r) => [r._id as string, r.count as number]));

  return {
    propertyViews: map.get("property_viewed") ?? 0,
    whatsappClicks: map.get("whatsapp_clicked") ?? 0,
    formSubmissions: map.get("contact_form_submitted") ?? 0,
    leadsGenerated: map.get("lead_generated") ?? 0,
  };
}
