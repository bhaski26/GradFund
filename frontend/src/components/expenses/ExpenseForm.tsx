import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    expenseSchema,
    type ExpenseFormData,
} from "@/schemas/expenseSchema";

import type {
    Expense,
    CreateExpenseRequest,
    UpdateExpenseRequest,
} from "@/types/expense";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExpenseFormProps {
    editingExpense?: Expense | null;
    onCancelEdit?: () => void;
    onAdd: (data: CreateExpenseRequest) => Promise<void>;
    onEdit: (
        id: number,
        data: UpdateExpenseRequest
    ) => Promise<void>;
    loading: boolean;
    error: string;
}

export default function ExpenseForm({
    editingExpense,
    onCancelEdit,
    onAdd,
    onEdit,
    loading,
    error,
}: ExpenseFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.input<typeof expenseSchema>, any, ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            title: "",
            amount: 0,
            category: "",
            expense_date: new Date()
                .toISOString()
                .split("T")[0],
        },
    });

    useEffect(() => {
        if (editingExpense) {
            reset({
                title: editingExpense.title,
                amount: editingExpense.amount,
                category: editingExpense.category,
                expense_date: editingExpense.expense_date,
            });
        } else {
            reset({
                title: "",
                amount: 0,
                category: "",
                expense_date: new Date()
                    .toISOString()
                    .split("T")[0],
            });
        }
    }, [editingExpense, reset]);

    async function onSubmit(data: ExpenseFormData) {
        if (editingExpense) {
            await onEdit(editingExpense.id, data);
            onCancelEdit?.();
        } else {
            await onAdd(data);

            reset({
                title: "",
                amount: 0,
                category: "",
                expense_date: new Date()
                    .toISOString()
                    .split("T")[0],
            });
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label htmlFor="title">
                    Expense Title
                </Label>

                <Input
                    id="title"
                    placeholder="e.g. Lunch"
                    {...register("title")}
                />

                {errors.title && (
                    <p className="text-sm text-red-500">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">
                    Amount
                </Label>

                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount")}
                />

                {errors.amount && (
                    <p className="text-sm text-red-500">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">
                    Category
                </Label>

                <select
                    id="category"
                    {...register("category")}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                    <option value="">
                        Select category
                    </option>

                    <option value="FOOD">Food</option>
                    <option value="TRANSPORT">
                        Transport
                    </option>
                    <option value="SHOPPING">
                        Shopping
                    </option>
                    <option value="BILLS">Bills</option>
                    <option value="ENTERTAINMENT">
                        Entertainment
                    </option>
                    <option value="HEALTHCARE">
                        Healthcare
                    </option>
                    <option value="EDUCATION">
                        Education
                    </option>
                    <option value="OTHER">Other</option>
                </select>

                {errors.category && (
                    <p className="text-sm text-red-500">
                        {errors.category.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="expense_date">
                    Expense Date
                </Label>

                <Input
                    id="expense_date"
                    type="date"
                    {...register("expense_date")}
                />

                {errors.expense_date && (
                    <p className="text-sm text-red-500">
                        {errors.expense_date.message}
                    </p>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? editingExpense
                            ? "Updating Expense..."
                            : "Saving Expense..."
                        : editingExpense
                            ? "Update Expense"
                            : "Add Expense"}
                </Button>

                {editingExpense && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancelEdit}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}