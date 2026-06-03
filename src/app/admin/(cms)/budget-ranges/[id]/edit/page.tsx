import React from "react";
import { getBudgetRangeById } from "@/actions/admin-budget-ranges";
import { BudgetRangeEditForm } from "@/components/admin/BudgetRangeEditForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBudgetRangePage({ params }: Props) {
  const { id } = await params;
  const range = await getBudgetRangeById(id);

  if (!range) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <BudgetRangeEditForm budgetRange={JSON.parse(JSON.stringify(range))} />
    </div>
  );
}
