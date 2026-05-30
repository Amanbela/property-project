"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { LeadEventModel } from "@/features/analytics/models/LeadEvent";
import { UserSessionModel } from "@/features/analytics/models/UserSession";

const EventTypeEnum = z.enum([
  "page_view",
  "property_viewed",
  "colony_viewed",
  "whatsapp_clicked",
  "call_clicked",
  "contact_form_submitted",
  "favorite_added",
  "property_shared",
  "lead_generated",
  "recommendation_requested",
]);

const propertySchema = z.object({
  propertyId: z.string().optional(),
  colonyId: z.string().optional(),
  builderId: z.string().optional(),
  areaName: z.string().optional(),
  colonyName: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  phone: z.string().optional(),
  budget: z.number().optional(),
  message: z.string().optional(),
});

const trackSchema = z.object({
  sessionId: z.string().min(1),
  eventType: EventTypeEnum,
  properties: propertySchema.optional().default({}),
  source: z.enum(["website", "whatsapp", "referral", "organic", "direct"]).optional().default("website"),
});

type TrackResult = { ok: true } | { ok: false; error: string };

const recentEvents = new Map<string, number>();

export async function trackEvent(input: z.infer<typeof trackSchema>): Promise<TrackResult> {
  const parsed = trackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid event data" };
  }

  const { sessionId, eventType, properties, source } = parsed.data;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "";
  const userAgent = h.get("user-agent") ?? "";
  const referrer = h.get("referer") ?? "";

  const dedupKey = `${sessionId}:${eventType}:${JSON.stringify(properties)}`;
  const now = Date.now();
  const lastEvent = recentEvents.get(dedupKey);
  if (lastEvent && now - lastEvent < 3000) {
    return { ok: true };
  }
  recentEvents.set(dedupKey, now);
  if (recentEvents.size > 10000) {
    const keysToDelete: string[] = [];
    for (const [key, time] of recentEvents.entries()) {
      if (now - time > 60000) keysToDelete.push(key);
    }
    keysToDelete.forEach((key) => recentEvents.delete(key));
  }

  try {
    await connectForWrites();

    await Promise.all([
      LeadEventModel.create({
        sessionId,
        eventType,
        properties: {
          ...properties,
          referrer: properties.referrer || referrer || "",
        },
        timestamp: new Date(),
        ip,
        userAgent,
        source,
      }),
      UserSessionModel.updateOne(
        { sessionId },
        {
          $setOnInsert: {
            sessionId,
            firstVisit: new Date(),
            ip,
            userAgent,
            referrer,
          },
          $set: { lastVisit: new Date() },
          $inc: { pageViews: 1 },
        },
        { upsert: true }
      ),
    ]);

    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to record event" };
  }
}
