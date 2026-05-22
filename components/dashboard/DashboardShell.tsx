"use client";

import Link from "next/link";
import { useTransition, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import type { SessionData } from "@/lib/auth/types";
import { type NavEntry, ROLE_NAV, ROLE_LABEL } from "@/lib/shared/navigation";

type NotificationCounts = Record<string, number>;

/* ── Sidebar inner (shared desktop + mobile) ────────────────────────── */

interface SidebarInnerProps {
  session: SessionData;
  navItems: NavEntry[];
  pathname: string;
  isPending: boolean;
  onSignOut: () => void;
  onClose?: () => void;
  notificationCounts?: NotificationCounts;
}

function SidebarInner({
  session,
  navItems,
  pathname,
  isPending,
  onSignOut,
  onClose,
  notificationCounts,
}: SidebarInnerProps) {
  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Logo row */}
      <div
        className="h-16 flex items-center justify-between px-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#d97706" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </span>
          <span className="text-white font-semibold text-[17px] tracking-tight">
            handy<span style={{ color: "#f59e0b" }}>Hire</span>
          </span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Close navigation"
          >
            <svg
              viewBox="0 0 20 20"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-0.5" role="list">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const count = notificationCounts?.[item.href] ?? 0;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-colors duration-150 group/nav
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                    ${
                      isActive
                        ? "text-white"
                        : "text-stone-500 hover:text-stone-200 hover:bg-white/5"
                    }`}
                  style={isActive ? { background: "rgba(255,255,255,0.09)" } : {}}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: "#f59e0b" }}
                    />
                  )}
                  <span
                    className={`shrink-0 transition-colors duration-150 ${
                      isActive ? "" : "group-hover/nav:text-stone-300"
                    }`}
                    style={isActive ? { color: "#f59e0b" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {count > 0 && (
                    <span
                      className="shrink-0 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center leading-none"
                      style={{ background: "#d97706", color: "#fff" }}
                      aria-label={`${count} unread`}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User card + sign out */}
      <div
        className="px-3 pb-5 pt-3 shrink-0 space-y-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 shrink-0"
            style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {session.name}
            </p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: "#6b6460" }}>
              {ROLE_LABEL[session.role]}
            </p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          disabled={isPending}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium
            text-stone-500 hover:text-stone-200 hover:bg-white/5
            transition-colors duration-150 disabled:opacity-40
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-4 h-4 shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
            <path d="M13 14l3-4m0 0l-3-4m3 4H7" />
          </svg>
          {isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}

/* ── Shell ──────────────────────────────────────────────────────────── */

interface Props {
  session: SessionData;
  children: ReactNode;
  notificationCounts?: NotificationCounts;
}

export default function DashboardShell({ session, children, notificationCounts }: Props) {
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navItems = ROLE_NAV[session.role] ?? [];
  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const innerProps: SidebarInnerProps = {
    session,
    navItems,
    pathname,
    isPending,
    onSignOut: handleSignOut,
    notificationCounts,
  };

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 lg:z-30"
        style={{ background: "#1C1917" }}
        aria-label="Dashboard sidebar"
      >
        <SidebarInner {...innerProps} />
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile: slide-in drawer ──────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col lg:hidden
          transition-transform duration-300 ease-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#1C1917" }}
        aria-label="Navigation drawer"
        aria-modal={drawerOpen}
        role={drawerOpen ? "dialog" : undefined}
      >
        <SidebarInner {...innerProps} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header
          className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between gap-3 px-4 shrink-0"
          style={{
            background: "rgba(253,250,245,0.94)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-1 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <svg
              viewBox="0 0 20 20"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-stone-900 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 text-amber-500"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </span>
            <span className="font-semibold text-stone-900 text-[15px] tracking-tight">
              handy<span className="text-amber-600">Hire</span>
            </span>
          </Link>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 shrink-0"
            style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
          >
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 py-10 md:py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
