"use server";

import { revalidatePath } from "next/cache";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { Agent as AgentModel } from "@/features/trust-network/models/Agent";
import { AgentSchema } from "@/shared/types/models";

async function assertAdmin() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") return false;
  return true;
}

export async function createAgent(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = AgentSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  try {
    await connectForWrites();
    await AgentModel.create(parsed.data);
    revalidatePath("/agents");
    revalidatePath("/admin/agents");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateAgent(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = AgentSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  try {
    await connectForWrites();
    await AgentModel.findByIdAndUpdate(id, parsed.data).exec();
    revalidatePath("/agents");
    revalidatePath("/admin/agents");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteAgent(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await AgentModel.findByIdAndDelete(id).exec();
  revalidatePath("/agents");
  revalidatePath("/admin/agents");
  return { ok: true as const };
}
