"use client";

import { BudgetRangeForm } from "./BudgetRangeForm";
import type { BudgetRange } from "@/shared/types/models";

interface Props {
  budgetRange: Partial<BudgetRange>;
}

export function BudgetRangeEditForm({ budgetRange }: Props) {
  return <BudgetRangeForm initialData={budgetRange} isEdit />;
}
