"use client";

import { useTransition } from "react";
import { deleteSeoPage } from "@/actions/admin-seo-pages";

export function DeleteSeoPageButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="ml-3 text-sm text-red-600 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Delete this SEO page?")) return;
        start(async () => {
          await deleteSeoPage(id);
          window.location.href = "/admin/seo-pages";
        });
      }}
    >
      Delete
    </button>
  );
}
