import { z } from "zod";

export const budgetSchema = z.object({
    monthly_limit: z.coerce
        .number()
        .positive("Monthly limit must be greater than 0"),

    month: z
        .string()
        .min(1, "Please select a month"),

    year: z.coerce
        .number()
        .min(2000, "Invalid year")
        .max(2100, "Invalid year"),
});

export type BudgetFormData = z.output<typeof budgetSchema>;