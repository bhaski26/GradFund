import { z } from "zod";

export const expenseSchema = z.object({
    title: z
        .string()
        .min(2, "Expense title must be at least 2 characters"),

    amount: z.coerce
        .number()
        .positive("Amount must be greater than 0"),

    category: z
        .string()
        .min(1, "Please select a category"),

    expense_date: z
        .string()
        .min(1, "Please select an expense date"),
});

export type ExpenseFormData = z.output<typeof expenseSchema>;