"use client";

import { useTransition } from "react";
import { deleteComparison } from "@/actions/admin-comparisons";

export function DeleteComparisonButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="ml-3 text-sm text-red-600 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Delete this comparison?")) return;
        start(async () => {
          await deleteComparison(id);
          window.location.reload();
        });
      }}
    >
      Delete
    </button>
  );
}
