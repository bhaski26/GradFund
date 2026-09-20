import { useEffect, useState } from "react";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "@/services/expenses";

import type {
    Expense,
    CreateExpenseRequest,
    UpdateExpenseRequest,
} from "@/types/expense";

export function useExpenses(
    month?: number,
    year?: number
) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchExpenses() {
        setLoading(true);
        setError("");

        try {
            const data = await getExpenses(month, year);
            setExpenses(data);
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                    "Failed to load expenses."
            );
        } finally {
            setLoading(false);
        }
    }

    async function addExpense(
        data: CreateExpenseRequest
    ) {
        setLoading(true);
        setError("");

        try {
            await createExpense(data);
            await fetchExpenses();
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                    "Failed to create expense."
            );
        } finally {
            setLoading(false);
        }
    }

    async function editExpense(
        id: number,
        data: UpdateExpenseRequest
    ) {
        setLoading(true);
        setError("");

        try {
            await updateExpense(id, data);
            await fetchExpenses();
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                    "Failed to update expense."
            );
        } finally {
            setLoading(false);
        }
    }

    async function removeExpense(id: number) {
        setLoading(true);
        setError("");

        try {
            await deleteExpense(id);
            await fetchExpenses();
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                    "Failed to delete expense."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchExpenses();
    }, [month, year]);

    return {
        expenses,
        loading,
        error,
        fetchExpenses,
        addExpense,
        editExpense,
        removeExpense,
    };
}