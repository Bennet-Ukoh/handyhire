import Link from "next/link";
import type { VerificationRecord, VerificationStatus } from "@/lib/worker/types";

/* ── Status config ──────────────────────────────────────────────────── */

interface StatusConfig {
  label: string;
  borderColor: string;
  chipBg: string;
  chipText: string;
  dotColor: string;
  iconBg: string;
  iconColor: string;
}

const STATUS_CONFIG: Record<VerificationStatus, StatusConfig> = {
  unverified: {
    label: "Not Started",
    borderColor: "#e7e5e4",
    chipBg: "rgba(0,0,0,0.04)",
    chipText: "#78716c",
    dotColor: "#a8a29e",
    iconBg: "#f5f5f4",
    iconColor: "#a8a29e",
  },
  pending: {
    label: "Submitted",
    borderColor: "#fcd34d",
    chipBg: "rgba(251,191,36,0.12)",
    chipText: "#92400e",
    dotColor: "#f59e0b",
    iconBg: "#fffbeb",
    iconColor: "#d97706",
  },
  in_review: {
    label: "In Review",
    borderColor: "#93c5fd",
    chipBg: "rgba(59,130,246,0.08)",
    chipText: "#1d4ed8",
    dotColor: "#3b82f6",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
  manual_review: {
    label: "Manual Review",
    borderColor: "#c4b5fd",
    chipBg: "rgba(139,92,246,0.08)",
    chipText: "#5b21b6",
    dotColor: "#8b5cf6",
    iconBg: "#f5f3ff",
    iconColor: "#7c3aed",
  },
  verified: {
    label: "Verified",
    borderColor: "#6ee7b7",
    chipBg: "rgba(16,185,129,0.08)",
    chipText: "#065f46",
    dotColor: "#10b981",
    iconBg: "#ecfdf5",
    iconColor: "#059669",
  },
  rejected: {
    label: "Action Required",
    borderColor: "#fca5a5",
    chipBg: "rgba(239,68,68,0.08)",
    chipText: "#b91c1c",
    dotColor: "#ef4444",
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
  },
};

/* ── Icons ──────────────────────────────────────────────────────────── */

function NINIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="7" cy="9.5" r="2" stroke={color} strokeWidth="1.4" />
      <path d="M11 8.5h4M11 11h3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3.5 16c0-1.5 1.6-2.5 3.5-2.5s3.5 1 3.5 2.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BGCheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
      <path d="M10 2.5L3.5 5.5v4.5c0 3.5 2.8 6.3 6.5 7 3.7-.7 6.5-3.5 6.5-7V5.5L10 2.5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10.5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.25 5.25-4 4a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.47-3.47a.75.75 0 1 1 1.06 1.06z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v3.5l2.5 1.5" />
    </svg>
  );
}

/* ── Formatters ─────────────────────────────────────────────────────── */

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Description logic ──────────────────────────────────────────────── */

function getDescription(
  type: "nin" | "backgroundCheck",
  record: VerificationRecord
): { main: string; sub?: string; cta?: string } {
  const { status } = record;

  if (type === "nin") {
    switch (status) {
      case "unverified":
        return {
          main: "Provide your 11-digit National Identity Number to verify your identity on HandyHire.",
          cta: "Submit NIN",
        };
      case "pending":
        return {
          main: `Your NIN was submitted on ${formatDate(record.submittedAt)} and is queued for review.`,
          sub: "We'll notify you when review starts.",
        };
      case "in_review":
        return {
          main: `Submitted ${formatDate(record.submittedAt)} — our compliance team is reviewing your identity documents.`,
          sub: "Estimated review time: 1–3 business days.",
        };
      case "manual_review":
        return {
          main: "Your NIN requires additional manual verification by our compliance team.",
          sub: "We may reach out for supporting documents. This typically takes 3–5 business days.",
        };
      case "verified":
        return {
          main: `Identity confirmed on ${formatDate(record.reviewedAt)}.`,
        };
      case "rejected":
        return {
          main: record.rejectionReason ?? "The submitted NIN could not be verified. Please check the number and resubmit.",
          cta: "Resubmit NIN",
        };
    }
  }

  // backgroundCheck
  switch (status) {
    case "unverified":
      return {
        main: "A background check confirms your work history and ensures client safety.",
        cta: "Start background check",
      };
    case "pending":
      return {
        main: `Background check submitted on ${formatDate(record.submittedAt)}.`,
        sub: "We'll notify you when review begins.",
      };
    case "in_review":
      return {
        main: `Submitted ${formatDate(record.submittedAt)} — check is in progress with our verification partner.`,
        sub: "Estimated review time: 2–5 business days.",
      };
    case "manual_review":
      return {
        main: "Your background check requires additional review by our compliance team.",
        sub: "We may reach out for supporting information. This typically takes 5–7 business days.",
      };
    case "verified":
      return {
        main: `Passed on ${formatDate(record.reviewedAt)}.`,
      };
    case "rejected":
      return {
        main: record.rejectionReason ?? "Background check could not be completed. Please contact support.",
        cta: "Contact support",
      };
  }
}

/* ── Component ──────────────────────────────────────────────────────── */

interface Props {
  type: "nin" | "backgroundCheck";
  record: VerificationRecord;
  ctaHref?: string;
}

export default function VerificationCard({ type, record, ctaHref }: Props) {
  const { status } = record;
  const cfg = STATUS_CONFIG[status];
  const { main, sub, cta } = getDescription(type, record);
  const isVerified = status === "verified";

  const title = type === "nin" ? "NIN Verification" : "Background Check";
  const Icon = type === "nin" ? NINIcon : BGCheckIcon;

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Colored top accent bar */}
      <div className="h-1 w-full" style={{ background: cfg.borderColor }} />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Header: icon + title */}
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: cfg.iconBg }}
          >
            <Icon color={cfg.iconColor} />
          </span>
          <span className="text-sm font-semibold text-stone-800">{title}</span>
        </div>

        {/* Status chip */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border"
            style={{
              background: cfg.chipBg,
              color: cfg.chipText,
              borderColor: cfg.borderColor,
            }}
          >
            {isVerified ? (
              <VerifiedCheckIcon />
            ) : (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg.dotColor }}
              />
            )}
            {cfg.label}
          </span>
          {(status === "pending" || status === "in_review" || status === "manual_review") && (
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <ClockIcon />
              {formatDate(record.submittedAt)}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <p className="text-sm text-stone-600 leading-relaxed">{main}</p>
          {sub && (
            <p className="text-xs text-stone-400 leading-relaxed">{sub}</p>
          )}
        </div>

        {/* CTA — spacer pushes it to bottom */}
        {cta && (
          <div className="mt-auto pt-1">
            {ctaHref ? (
              <Link
                href={ctaHref}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 ${
                  status === "rejected"
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "text-white hover:-translate-y-px"
                }`}
                style={
                  status !== "rejected"
                    ? {
                        background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                        boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
                      }
                    : undefined
                }
              >
                {cta}
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 ${
                  status === "rejected"
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "text-white hover:-translate-y-px"
                }`}
                style={
                  status !== "rejected"
                    ? {
                        background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                        boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
                      }
                    : undefined
                }
              >
                {cta}
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
