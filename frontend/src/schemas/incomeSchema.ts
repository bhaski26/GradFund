import { z } from "zod";

export const incomeSchema = z.object({
    source: z
        .string()
        .min(2, "Income source must be at least 2 characters"),

    amount: z.coerce
        .number()
        .positive("Amount must be greater than 0"),

    month: z
        .string()
        .min(1, "Please select a month"),

    year: z.coerce
        .number()
        .min(2000, "Invalid year")
        .max(2100, "Invalid year"),
});

export type IncomeFormData = z.output<typeof incomeSchema>;