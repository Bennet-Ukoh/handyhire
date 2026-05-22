"use server";

import { getSession } from "@/lib/auth/session";
import { submitQuoteSchema } from "./schemas";
import { insertQuote, findQuotesByJobId } from "@/lib/shared/quote-store";
import { findJobById, incrementQuoteCount } from "@/lib/client/mock-store";
import { getVerification } from "./verification-store";
import type { ActionState } from "@/lib/auth/types";

export async function submitQuoteAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker to submit a quote." };
  }

  const raw = {
    jobId: formData.get("jobId"),
    amountNgn: formData.get("amountNgn"),
    note: formData.get("note") || undefined,
  };

  const parsed = submitQuoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: parsed.error.issues[0].message, fieldErrors };
  }

  const { jobId, amountNgn, note } = parsed.data;

  // Prevent duplicate quotes from the same worker on the same job
  const existing = findQuotesByJobId(jobId);
  if (existing.some((q) => q.workerId === session.userId)) {
    return { error: "You have already submitted a quote for this job." };
  }

  const job = findJobById(jobId);
  const jobTitle = job?.title ?? "Job";
  const location = job?.location ?? "";
  const clientName = "Client";

  const v = getVerification(session.userId);
  const workerIsVerified = v.nin.status === "verified" && v.backgroundCheck.status === "verified";

  insertQuote({
    id: `q_${Date.now()}`,
    jobId,
    jobTitle,
    workerId: session.userId,
    workerName: session.name,
    workerTrade: session.trade ?? "General Handyman",
    workerAverageRating: 0,
    workerReviewCount: 0,
    workerIsVerified,
    amountNgn,
    status: "pending",
    submittedAt: new Date().toISOString(),
    clientName,
    location,
    note,
  });

  incrementQuoteCount(jobId);

  return {};
}
