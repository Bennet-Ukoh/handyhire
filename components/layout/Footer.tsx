import Link from "next/link";

const links = {
  Company: [
    { label: "About us", href: "/about" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  "For Clients": [
    { label: "Post a job", href: "/post-job" },
    { label: "Browse workers", href: "/workers" },
    { label: "Categories", href: "#services" },
    { label: "Pricing", href: "/pricing" },
  ],
  "For Workers": [
    { label: "Join as a worker", href: "/auth/signup?role=worker" },
    { label: "How to get hired", href: "/workers/guide" },
    { label: "Verification", href: "/workers/verify" },
    { label: "Worker stories", href: "/stories" },
  ],
  Support: [
    { label: "Help centre", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Dispute resolution", href: "/disputes" },
    { label: "Contact us", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-cream" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-10">
        {/* Top row: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-stone-900"
                  aria-hidden="true"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </span>
              <span className="font-semibold text-cream text-lg tracking-tight">
                handy<span className="text-amber-500">Hire</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-[18ch]">
              Skilled work, verified people, trusted results.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {/* Social icons placeholder */}
              {["X", "IG", "LI"].map((s) => (
                <button
                  key={s}
                  aria-label={`Follow us on ${s}`}
                  className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-cream hover:bg-stone-700 transition-colors text-[10px] font-bold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-stone-400 hover:text-cream transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} HandyHire Technologies Ltd. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
