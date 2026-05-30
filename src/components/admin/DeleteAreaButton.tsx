"use client";

import { useTransition } from "react";
import { deleteArea } from "@/actions/admin-areas";

export function DeleteAreaButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="ml-3 text-sm text-red-600 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Delete this area?")) return;
        start(async () => {
          await deleteArea(id);
          window.location.reload();
        });
      }}
    >
      Delete
    </button>
  );
}
