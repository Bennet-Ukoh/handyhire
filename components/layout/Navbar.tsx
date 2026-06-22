"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/70">
      <nav
        className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-amber-500"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </span>
          <span className="font-semibold text-stone-900 text-lg tracking-tight">
            handy<span className="text-amber-600">Hire</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {[
            { href: "#how-it-works", label: "How it works" },
            { href: "#services", label: "Services" },
            { href: "#why-handyhire", label: "Why HandyHire?" },
           
          ].map(({ href, label }) => (
            <li key={href}>
            <Link
              href={href}
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors duration-150"
            
            >
              {label}
            </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors duration-150 px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-medium bg-stone-900 text-cream px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors duration-150"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-dark transition-colors duration-150"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span
              className={`block h-[1.5px] bg-stone-900 transition-all duration-200 origin-center ${
                open ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] bg-stone-900 transition-all duration-200 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] bg-stone-900 transition-all duration-200 origin-center ${
                open ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          open ? "max-h-80 border-t border-stone-200" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="bg-white px-6 py-5 space-y-1">
          {[
            { href: "#how-it-works", label: "How it works" },
            { href: "#services", label: "Services" },
            { href: "#why-handyhire", label: "Why HandyHire?" },
           
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-stone-600 py-2.5 hover:text-stone-900 transition-colors"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-stone-900 py-2"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-stone-900 text-cream px-4 py-2.5 rounded-lg text-center"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
