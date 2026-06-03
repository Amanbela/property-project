"use client";

import { useTransition } from "react";
import { deleteBudgetRange } from "@/actions/admin-budget-ranges";

export function DeleteBudgetRangeButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="ml-3 text-sm text-red-600 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Delete this budget range?")) return;
        start(async () => {
          await deleteBudgetRange(id);
          window.location.reload();
        });
      }}
    >
      Delete
    </button>
  );
}
