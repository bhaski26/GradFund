import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";

import { useExpenses } from "@/hooks/useExpenses";

import type { Expense } from "@/types/expense";


const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


export default function Expenses() {
    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    /*
     * null means "Overall"
     */
    const [selectedPeriod, setSelectedPeriod] = useState<
        { month: number; year: number } | null
    >({
        month: currentMonth,
        year: currentYear,
    });


    const {
        expenses,
        loading,
        error,
        addExpense,
        editExpense,
        removeExpense,
    } = useExpenses(
        selectedPeriod?.month,
        selectedPeriod?.year
    );


    const [selectedExpense, setSelectedExpense] =
        useState<Expense | null>(null);


    function handleEdit(expense: Expense) {
        setSelectedExpense(expense);
    }


    async function handleDelete(id: number) {
        await removeExpense(id);
    }


    function handlePeriodChange(
        value: string
    ) {
        if (value === "overall") {
            setSelectedPeriod(null);
            return;
        }

        const [month, year] = value
            .split("-")
            .map(Number);

        setSelectedPeriod({
            month,
            year,
        });
    }


    const selectedValue = selectedPeriod
        ? `${selectedPeriod.month}-${selectedPeriod.year}`
        : "overall";


    /*
     * Generate a useful list of months:
     * current month + previous 11 months.
     */
    const periodOptions = Array.from(
        { length: 12 },
        (_, index) => {
            const date = new Date(
                currentYear,
                currentMonth - 1 - index,
                1
            );

            return {
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
            };
        }
    );


    return (
        <DashboardLayout>
            <div className="space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">
                        Expenses
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track and manage your expenses.
                    </p>
                </div>


                {/* Period Selector */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Expense Period
                        </h2>

                        <p className="text-sm text-slate-500">
                            Choose a month or view all expenses.
                        </p>
                    </div>


                    <select
                        value={selectedValue}
                        onChange={(event) =>
                            handlePeriodChange(
                                event.target.value
                            )
                        }
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    >

                        {periodOptions.map(
                            (period) => (
                                <option
                                    key={`${period.month}-${period.year}`}
                                    value={`${period.month}-${period.year}`}
                                >
                                    {period.label}
                                </option>
                            )
                        )}

                        <option value="overall">
                            Overall
                        </option>

                    </select>

                </div>


                {/* Expense Form */}
                <ExpenseForm
                    editingExpense={selectedExpense}
                    onCancelEdit={() =>
                        setSelectedExpense(null)
                    }
                    onAdd={addExpense}
                    onEdit={editExpense}
                    loading={loading}
                    error={error}
                />


                {/* Expense Table */}
                <ExpenseTable
                    expenses={expenses}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>
        </DashboardLayout>
    );
}