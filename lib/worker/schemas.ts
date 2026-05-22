import { z } from "zod";

export const submitQuoteSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  amountNgn: z.coerce
    .number({ message: "Enter a valid amount" })
    .min(500, "Minimum quote is ₦500"),
  note: z
    .string()
    .max(500, "Note must be under 500 characters")
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),
});

export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>;

export const submitNINSchema = z.object({
  nin: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "NIN must be exactly 11 digits"),
});

export type SubmitNINInput = z.infer<typeof submitNINSchema>;

export const startBGCheckSchema = z.object({
  consent: z.literal("true", "You must agree to the background check terms"),
});

export type StartBGCheckInput = z.infer<typeof startBGCheckSchema>;
