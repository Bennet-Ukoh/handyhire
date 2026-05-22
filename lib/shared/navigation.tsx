/**
 * Role-based navigation configuration.
 *
 * Centralised here so any future nav consumers (mobile nav, sitemap, tests)
 * can import config without depending on a UI component.
 */

import type { ReactNode } from "react";
import type { UserRole } from "@/lib/auth/types";

export interface NavEntry {
  href: string;
  label: string;
  icon: ReactNode;
}

export const WORKER_NAV: NavEntry[] = [
  {
    href: "/worker/dashboard",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/worker/jobs",
    label: "Browse Jobs",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="16" height="11" rx="2" />
        <path d="M7 7V5a3 3 0 0 1 6 0v2" />
        <path d="M10 12v2" />
      </svg>
    ),
  },
  {
    href: "/worker/quotes",
    label: "My Quotes",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
        <rect x="7" y="1" width="6" height="4" rx="1" />
        <path d="M7 11l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/worker/earnings",
    label: "Earnings",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 15l4-5 3 3 4-6 3 4" />
        <path d="M2 18h16" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 10c0 3.87-3.13 7-7 7a7.1 7.1 0 0 1-3.33-.83L2 18l1.83-4.67A6.96 6.96 0 0 1 3 10c0-3.87 3.13-7 7-7s7 3.13 7 7z" />
      </svg>
    ),
  },
  {
    href: "/worker/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="7" r="3.5" />
        <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      </svg>
    ),
  },
];

export const CLIENT_NAV: NavEntry[] = [
  {
    href: "/client/dashboard",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/client/post-job",
    label: "Post a Job",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v8M6 10h8" />
      </svg>
    ),
  },
  {
    href: "/client/jobs",
    label: "My Jobs",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="16" height="11" rx="2" />
        <path d="M7 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 10c0 3.87-3.13 7-7 7a7.1 7.1 0 0 1-3.33-.83L2 18l1.83-4.67A6.96 6.96 0 0 1 3 10c0-3.87 3.13-7 7-7s7 3.13 7 7z" />
      </svg>
    ),
  },
  {
    href: "/client/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="7" r="3.5" />
        <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      </svg>
    ),
  },
];

export const ADMIN_NAV: NavEntry[] = [
  {
    href: "/admin/dashboard",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/workers",
    label: "Workers",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7.5" cy="6.5" r="2.5" />
        <path d="M2 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        <circle cx="14" cy="7" r="2" />
        <path d="M16.5 17c0-2-1.5-3.5-4-4" />
      </svg>
    ),
  },
  {
    href: "/admin/verifications",
    label: "Verifications",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2.5L3.5 5.5v4.5c0 3.5 2.8 6.3 6.5 7 3.7-.7 6.5-3.5 6.5-7V5.5L10 2.5z" />
        <path d="M7 10.5l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.41 1.41M14.36 14.36l1.41 1.41M4.22 15.78l1.41-1.41M14.36 5.64l1.41-1.41" />
      </svg>
    ),
  },
];

export const ROLE_NAV: Record<UserRole, NavEntry[]> = {
  worker: WORKER_NAV,
  client: CLIENT_NAV,
  admin: ADMIN_NAV,
};

export const ROLE_LABEL: Record<UserRole, string> = {
  worker: "Tradesperson",
  client: "Client",
  admin: "Admin",
};
