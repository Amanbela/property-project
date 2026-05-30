"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { LeadModel } from "@/features/lead-engine/models/Lead";

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

const statusEnum = z.enum(["new", "contacted", "interested", "closed"]);

export async function updateLeadStatus(id: string, status: z.infer<typeof statusEnum>, notes?: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  const st = statusEnum.safeParse(status);
  if (!st.success) return { ok: false as const, error: "Invalid status" };
  await connectForWrites();
  await LeadModel.findByIdAndUpdate(id, { status: st.data, ...(notes !== undefined ? { notes } : {}) }).exec();
  revalidatePath("/admin/leads");
  return { ok: true as const };
}

export async function updateLeadFromForm(formData: FormData) {
  if (!(await assertAdmin())) return;
  const id = String(formData.get("leadId") ?? "");
  const status = formData.get("status");
  const st = statusEnum.safeParse(status);
  if (!id || !st.success) return;
  await connectForWrites();
  await LeadModel.findByIdAndUpdate(id, { status: st.data }).exec();
  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

export async function exportLeadsCsv() {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  const rows = await LeadModel.find().sort({ createdAt: -1 }).lean();
  const header = ["id", "name", "phone", "budget", "preferredArea", "purpose", "status", "notes", "createdAt"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const row = [
      String(r._id),
      escapeCsv(String(r.name)),
      escapeCsv(String(r.phone)),
      r.budget ?? "",
      escapeCsv(String(r.preferredArea ?? "")),
      escapeCsv(String(r.purpose ?? "")),
      r.status,
      escapeCsv(String(r.notes ?? "")),
      r.createdAt ? new Date(r.createdAt).toISOString() : ""
    ];
    lines.push(row.join(","));
  }
  return { ok: true as const, csv: lines.join("\n") };
}

function escapeCsv(v: string) {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
