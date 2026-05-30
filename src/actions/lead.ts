"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { LeadModel } from "@/features/lead-engine/models/Lead";
import { LeadInput } from "@/types";
import { rateLimitLead } from "@/lib/rate-limit";

const leadSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  budget: z.coerce.number().min(0),
  preferredArea: z.string().max(200).optional().default(""),
  purpose: z.enum(["investment", "family-living", "rental-income"] as const)
});

export async function createLead(input: LeadInput) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid form data." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  if (!rateLimitLead(ip)) {
    return { ok: false as const, message: "Too many submissions. Please try again shortly." };
  }

  if (!isMongoConfigured()) {
    return { ok: false as const, message: "Lead intake is unavailable until the database is configured." };
  }

  try {
    await connectDB();
    await LeadModel.create({
      ...parsed.data,
      preferredArea: parsed.data.preferredArea || undefined,
      source: "website",
      status: "new"
    });
    return { ok: true as const, message: "Lead submitted successfully." };
  } catch {
    return { ok: false as const, message: "Failed to submit lead." };
  }
}
