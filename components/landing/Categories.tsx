import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const categories = [
  {
    name: "Plumbing",
    count: 840,
    href: "/workers?category=plumbing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M5 12H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M19 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <rect x="8" y="7" width="8" height="14" rx="1" />
        <path d="M12 12v3" />
      </svg>
    ),
  },
  {
    name: "Electrical",
    count: 1210,
    href: "/workers?category=electrical",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "Carpentry",
    count: 620,
    href: "/workers?category=carpentry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" />
        <path d="M17.64 15L22 10.64" />
        <path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
      </svg>
    ),
  },
  {
    name: "Cleaning",
    count: 990,
    href: "/workers?category=cleaning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Painting",
    count: 530,
    href: "/workers?category=painting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z" />
        <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
        <path d="M14.5 17.5L4.5 15" />
      </svg>
    ),
  },
  {
    name: "Moving",
    count: 370,
    href: "/workers?category=moving",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    name: "HVAC",
    count: 290,
    href: "/workers?category=hvac",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M12 2v7" />
        <path d="m6.8 15-5 2.9" />
        <path d="m17.2 15 5 2.9" />
        <path d="M6.8 9 2 6" />
        <path d="m17.2 9 4.8-3" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 22v-3" />
      </svg>
    ),
  },
  {
    name: "Landscaping",
    count: 460,
    href: "/workers?category=landscaping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <path d="M17 8C8 10 5.9 16.17 3.82 22" />
        <path d="M9.07 9.07C11.34 7.3 14.1 6 17 5" />
        <path d="M12 12C10 14 9 16 8 22" />
        <path d="M17 5c0 0-1.5 3-4 5.5" />
        <path d="M21 3c-5.33 2-8 5.33-8 10" />
      </svg>
    ),
  },
];

export default function Categories() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "#F5F0E8" }}
      aria-labelledby="categories-heading"
    >
      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 50% 110%, rgba(217,119,6,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: GRAIN, opacity: 0.035 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 md:mb-12">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
              Services
            </p>
            <h2
              id="categories-heading"
              className="font-display text-4xl md:text-5xl text-stone-900 tracking-tight"
            >
              Every trade, covered
            </h2>
          </div>
          <Link
            href="/workers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors shrink-0"
          >
            View all services
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </ScrollReveal>

        {/* Grid */}
        <ScrollReveal delay={60}>
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            role="list"
          >
            {categories.map(({ name, count, href, icon }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="group flex flex-col gap-4 rounded-2xl p-5 md:p-6 border border-stone-200/70 hover:border-amber-300/80 hover:-translate-y-1 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:bg-amber-100 group-hover:scale-110 group-hover:text-amber-800 transition-all duration-200 origin-center">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm mb-1 group-hover:text-amber-700 transition-colors duration-150">
                      {name}
                    </p>
                    <p className="text-xs text-stone-400">
                      {count.toLocaleString()} active jobs
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
