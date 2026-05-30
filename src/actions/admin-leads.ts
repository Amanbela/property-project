"use server";

import { z } from "zod";
import { getAdminSession } from "@/lib/auth-guard";
import { LeadRepository } from "@/infrastructure/db/repositories/LeadRepository";
import { LeadModel } from "@/features/lead-engine/models/Lead";

const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "interested", "closed"]),
});

export async function updateLeadStatus(input: z.infer<typeof updateStatusSchema>) {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input" };
  }

  try {
    await LeadRepository.updateStatus(parsed.data.id, parsed.data.status);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function exportLeadsCsv() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, csv: "" };
  }

  try {
    await import("@/infrastructure/db/connection").then((m) => m.connectForWrites());
    const leads = await LeadModel.find({}).sort({ createdAt: -1 }).lean().exec();

    const header = "Name,Phone,Area,Budget,Status,Created\n";
    const rows = leads
      .map((l) =>
        [
          `"${(l.name || "").replace(/"/g, '""')}"`,
          l.phone || "",
          l.preferredArea || "",
          l.budget ?? "",
          l.status || "new",
          l.createdAt ? new Date(l.createdAt as Date).toISOString().split("T")[0] : "",
        ].join(",")
      )
      .join("\n");

    return { ok: true as const, csv: header + rows };
  } catch {
    return { ok: false as const, csv: "" };
  }
}
