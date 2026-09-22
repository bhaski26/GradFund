import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    budgetSchema,
    type BudgetFormData,
} from "@/schemas/budgetSchema";

import type {
    Budget,
    CreateBudgetRequest,
    UpdateBudgetRequest,
} from "@/types/budget";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetFormProps {
    editingBudget?: Budget | null;
    onCancelEdit?: () => void;
    onAdd: (data: CreateBudgetRequest) => Promise<void>;
    onEdit: (
        id: number,
        data: UpdateBudgetRequest
    ) => Promise<void>;
    loading: boolean;
    error: string;
}

export default function BudgetForm({
    editingBudget,
    onCancelEdit,
    onAdd,
    onEdit,
    loading,
    error,
}: BudgetFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.input<typeof budgetSchema>, any, BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            monthly_limit: 0,
            month: "",
            year: new Date().getFullYear(),
        },
    });

    useEffect(() => {
        if (editingBudget) {
            reset({
                monthly_limit: editingBudget.monthly_limit,
                month: editingBudget.month,
                year: editingBudget.year,
            });
        } else {
            reset({
                monthly_limit: 0,
                month: "",
                year: new Date().getFullYear(),
            });
        }
    }, [editingBudget, reset]);

    async function onSubmit(data: BudgetFormData) {
        if (editingBudget) {
            await onEdit(editingBudget.id, data);
            return;
        }

        await onAdd(data);

        reset({
            monthly_limit: 0,
            month: "",
            year: new Date().getFullYear(),
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label htmlFor="monthly_limit">
                    Monthly Limit
                </Label>

                <Input
                    id="monthly_limit"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 25000"
                    {...register("monthly_limit")}
                />

                {errors.monthly_limit && (
                    <p className="text-sm text-red-500">
                        {errors.monthly_limit.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="month">
                    Month
                </Label>

                <select
                    id="month"
                    {...register("month")}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                    <option value="">
                        Select month
                    </option>

                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>

                {errors.month && (
                    <p className="text-sm text-red-500">
                        {errors.month.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="year">
                    Year
                </Label>

                <Input
                    id="year"
                    type="number"
                    {...register("year")}
                />

                {errors.year && (
                    <p className="text-sm text-red-500">
                        {errors.year.message}
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
                        ? editingBudget
                            ? "Updating Budget..."
                            : "Saving Budget..."
                        : editingBudget
                            ? "Update Budget"
                            : "Set Budget"}
                </Button>

                {editingBudget && (
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