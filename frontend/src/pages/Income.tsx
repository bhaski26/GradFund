import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import IncomeForm from "@/components/income/IncomeForm";
import IncomeTable from "@/components/income/IncomeTable";

import { useIncome } from "@/hooks/useIncome";

import type { Income } from "@/types/income";

export default function Income() {
    const {
        income,
        loading,
        error,
        addIncome,
        editIncome,
        removeIncome,
    } = useIncome();

    const [selectedIncome, setSelectedIncome] =
        useState<Income | null>(null);

    function handleEdit(income: Income) {
        setSelectedIncome(income);
    }

    async function handleDelete(id: number) {
        await removeIncome(id);
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        Income
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track and manage all your income sources.
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                <IncomeForm
                    editingIncome={selectedIncome}
                    onCancelEdit={() => setSelectedIncome(null)}
                    onAdd={addIncome}
                    onEdit={editIncome}
                    loading={loading}
                    error={error}
                />

                <IncomeTable
                    income={income}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </DashboardLayout>
    );
}