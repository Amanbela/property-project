"use server";

import { revalidatePath } from "next/cache";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { Builder as BuilderModel } from "@/features/trust-network/models/Builder";
import { BuilderSchema } from "@/shared/types/models";

async function assertAdmin() {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") return false;
  return true;
}

export async function createBuilder(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BuilderSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  try {
    await connectForWrites();
    await BuilderModel.create(parsed.data);
    revalidatePath("/builders");
    revalidatePath("/admin/builders");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateBuilder(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BuilderSchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.flatten().fieldErrors };

  try {
    await connectForWrites();
    await BuilderModel.findByIdAndUpdate(id, parsed.data).exec();
    revalidatePath("/builders");
    revalidatePath("/admin/builders");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function deleteBuilder(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await BuilderModel.findByIdAndDelete(id).exec();
  revalidatePath("/builders");
  revalidatePath("/admin/builders");
  return { ok: true as const };
}
