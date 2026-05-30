import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { LeadModel } from "@/features/lead-engine/models/Lead";

export type LeadDoc = {
  id: string;
  name: string;
  phone: string;
  budget?: number;
  preferredArea?: string;
  purpose?: string;
  source?: string;
  status: "new" | "contacted" | "interested" | "closed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

function toPublic(doc: Record<string, unknown> | null): LeadDoc | null {
  if (!doc) return null;
  return {
    id: String(doc._id),
    name: String(doc.name),
    phone: String(doc.phone),
    budget: doc.budget != null ? Number(doc.budget) : undefined,
    preferredArea: doc.preferredArea ? String(doc.preferredArea) : undefined,
    purpose: doc.purpose ? String(doc.purpose) : undefined,
    source: doc.source ? String(doc.source) : undefined,
    status: (doc.status as LeadDoc["status"]) ?? "new",
    notes: doc.notes ? String(doc.notes) : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as Date).toISOString() : undefined
  };
}

export async function listLeadsAdmin(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: LeadDoc["status"] | "all";
}) {
  if (!isMongoConfigured()) {
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    return { total: 0, page: Math.max(1, params.page ?? 1), pageSize, items: [] };
  }
  await connectDB();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const filter: Record<string, unknown> = {};
  if (params.status && params.status !== "all") filter.status = params.status;
  if (params.search) {
    filter.$or = [
      { name: new RegExp(params.search, "i") },
      { phone: new RegExp(params.search, "i") },
      { preferredArea: new RegExp(params.search, "i") }
    ];
  }
  const [total, rows] = await Promise.all([
    LeadModel.countDocuments(filter),
    LeadModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()
  ]);
  return { total, page, pageSize, items: rows.map((r) => toPublic(r as Record<string, unknown>)!) };
}

export async function getRecentLeads(limit = 8): Promise<LeadDoc[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = await LeadModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  return rows.map((r) => toPublic(r as Record<string, unknown>)!);
}

export async function countLeads() {
  if (!isMongoConfigured()) return 0;
  await connectDB();
  return LeadModel.countDocuments();
}

export async function getLeadById(id: string) {
  if (!isMongoConfigured()) return null;
  await connectDB();
  const doc = await LeadModel.findById(id).lean();
  return toPublic(doc as Record<string, unknown> | null);
}
