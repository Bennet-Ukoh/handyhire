import ScrollReveal from "@/components/ui/ScrollReveal";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const stats = [
  { value: "10,000+", label: "Jobs completed" },
  { value: "4.8", label: "Average rating" },
  { value: "2,400+", label: "Verified workers" },
  { value: "48", label: "Cities covered" },
];

const pillars = [
  {
    title: "Every worker verified",
    description:
      "All professionals undergo NIN verification, credential checks, and background screening before they can accept any job.",
    gradientFrom: "#d97706",
    gradientTo: "#92400e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Secure, held payments",
    description:
      "Your payment is held in escrow until the job is done to your satisfaction. No upfront risk, no disputes left unresolved.",
    gradientFrom: "#10b981",
    gradientTo: "#065f46",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    title: "Real dispute support",
    description:
      "Our team mediates any issue that arises — from quality concerns to scheduling conflicts. You are protected at every stage.",
    gradientFrom: "#3b82f6",
    gradientTo: "#1e3a8a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  return (
    <section aria-labelledby="why-handyhire-heading">
      {/* ── Stats band ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#0E0B08" }}
      >
        {/* Ambient glow */}
        <div
          className="hh-blob absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ backgroundImage: GRAIN, opacity: 0.04 }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <ul
            className="grid grid-cols-2 lg:grid-cols-4"
            role="list"
            aria-label="Platform statistics"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            {stats.map(({ value, label }, i) => (
              <li
                key={label}
                className={`text-center px-6 py-12 md:py-16 ${
                  i === 3
                    ? ""
                    : i % 2 === 0
                      ? "border-r border-white/5"
                      : "lg:border-r lg:border-white/5"
                }`}
              >
                <p
                  className="font-display text-5xl md:text-6xl lg:text-7xl text-amber-400 leading-none mb-3"
                  style={{ textShadow: "0 0 40px rgba(251,191,36,0.25)" }}
                >
                  {value}
                </p>
                <p className="text-sm font-medium" style={{ color: "#78716c" }}>{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Trust pillars ── */}
      <div
        className="relative overflow-hidden py-20 md:py-24"
        style={{ background: "#FDFAF5" }}
      >
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ backgroundImage: GRAIN, opacity: 0.03 }}
          id="why-handyhire"
          aria-label="Why HandyHire"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <ScrollReveal className="text-center mb-12">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
              Why HandyHire
            </p>
            <h2
              id="why-handyhire-heading"
              className="font-display text-4xl md:text-5xl text-stone-900 tracking-tight"
            >
              Built on trust, by design
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {pillars.map(({ title, description, icon, gradientFrom, gradientTo }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <div
                  className="group relative bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-200"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Gradient top bar */}
                  <div
                    className="h-[3px] w-full"
                    style={{ background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
                    aria-hidden="true"
                  />
                  <div className="p-7 flex flex-col gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-400"
                      style={{ background: "linear-gradient(145deg, #1c1917 0%, #292524 100%)" }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 text-base mb-2">{title}</h3>
                      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
