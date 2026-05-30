import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminSession() {
  return getServerSession(authOptions);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session?.user?.email || session.user.role !== "admin") {
    return null;
  }
  return session;
}
