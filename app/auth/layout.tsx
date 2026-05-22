import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative"
      style={{ background: "#FDFAF5" }}
    >
      {/* Ambient glows — decorative only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(217,119,6,0.10) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 80% 80%, rgba(217,119,6,0.07) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 mb-5 relative"
        aria-label="HandyHire — go to homepage"
      >
        <span className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[18px] h-[18px] text-amber-500"
            aria-hidden="true"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </span>
        <span className="font-semibold text-stone-900 text-xl tracking-tight">
          handy<span className="text-amber-600">Hire</span>
        </span>
      </Link>

      {/* Page content */}
      <div className="relative w-full max-w-[420px]">{children}</div>
    </div>
  );
}
