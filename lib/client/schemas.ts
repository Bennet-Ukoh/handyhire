import { z } from "zod";
import { TRADE_CATEGORIES } from "@/lib/shared/types";

export const postJobSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be under 100 characters"),
    category: z.enum(TRADE_CATEGORIES, {
      error: "Select a trade category",
    }),
    description: z
      .string()
      .min(20, "Please describe the job in at least 20 characters")
      .max(2000, "Description must be under 2000 characters"),
    budgetMinNgn: z.coerce
      .number({ message: "Enter a valid minimum budget" })
      .min(1000, "Minimum budget is ₦1,000"),
    budgetMaxNgn: z.coerce
      .number({ message: "Enter a valid maximum budget" })
      .min(1000, "Maximum budget is ₦1,000"),
    location: z
      .string()
      .min(3, "Enter a location")
      .max(200, "Location is too long"),
    urgency: z.enum(["normal", "urgent"]),
    photoUrls: z
      .string()
      .optional()
      .transform((v) => {
        try {
          return JSON.parse(v ?? "[]") as string[];
        } catch {
          return [] as string[];
        }
      }),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
  })
  .refine((d) => d.budgetMaxNgn >= d.budgetMinNgn, {
    message: "Maximum budget must be at least the minimum",
    path: ["budgetMaxNgn"],
  });

export type PostJobInput = z.infer<typeof postJobSchema>;
