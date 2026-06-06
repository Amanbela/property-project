"use server";

import { revalidatePath } from "next/cache";
import { connectForWrites } from "@/infrastructure/db/connection";
import { getAdminSession } from "@/lib/auth-guard";
import { BlogModel } from "@/infrastructure/seo/models/Blog";
import { BlogSchema } from "@/shared/types/models";
import { slugify } from "@/utils/slug";
import { deleteImage } from "@/lib/cloudinary";

async function assertAdmin() {
  const s = await getAdminSession();
  return !!(s?.user?.email && s.user.role === "admin");
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await BlogModel.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).exec()) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function createBlog(data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BlogSchema.safeParse(data);

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    await connectForWrites();
    const slug = await ensureUniqueSlug(slugify(parsed.data.slug || parsed.data.title));
    const { _id, createdAt, updatedAt, ...rest } = parsed.data;
    await BlogModel.create({ ...rest, slug });
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function updateBlog(id: string, data: Record<string, unknown>) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };

  const parsed = BlogSchema.safeParse(data);

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    await connectForWrites();
    const slug = await ensureUniqueSlug(slugify(parsed.data.slug || parsed.data.title), id);
    const { _id, createdAt, updatedAt, ...rest } = parsed.data;
    await BlogModel.findByIdAndUpdate(id, { ...rest, slug }).exec();
    revalidatePath("/blog");
    revalidatePath("/blog/" + slug);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function autosaveBlogDraft(id: string, content: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  await BlogModel.findByIdAndUpdate(id, { content, lastAutosavedAt: new Date() }).exec();
  return { ok: true as const };
}

export async function deleteBlog(id: string) {
  if (!(await assertAdmin())) return { ok: false as const, error: "Unauthorized" };
  await connectForWrites();
  const blog = await BlogModel.findById(id).lean();
  if (blog) {
    const featured = blog.featuredImage as { publicId?: string } | undefined;
    if (featured?.publicId) {
      await deleteImage(featured.publicId);
    }
  }
  await BlogModel.findByIdAndDelete(id).exec();
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  revalidatePath("/");
  return { ok: true as const };
}
