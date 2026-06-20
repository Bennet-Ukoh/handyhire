import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const earners = [
  { init: "EO", bg: "bg-blue-100", text: "text-blue-700", name: "Emmanuel O.", trade: "Plumber", earnings: "₦480k/mo" },
  { init: "CJ", bg: "bg-amber-100", text: "text-amber-700", name: "Chinonso J.", trade: "Electrician", earnings: "₦620k/mo" },
  { init: "AF", bg: "bg-teal-100", text: "text-teal-700", name: "Adaeze F.", trade: "Painter", earnings: "₦310k/mo" },
];

export default function WorkerCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#110E09" }}
      aria-labelledby="worker-cta-heading"
    >
      {/* ── Animated blobs ── */}
      <div
        className="hh-blob-b absolute top-[-10%] right-[-8%] w-[550px] h-[550px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(217,119,6,0.14) 0%, transparent 68%)",
          filter: "blur(72px)",
        }}
      />
      <div
        className="hh-blob absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(120,53,15,0.1) 0%, transparent 68%)",
          filter: "blur(64px)",
          animationDelay: "-11s",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: GRAIN, opacity: 0.04 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Left: copy ── */}
          <ScrollReveal className="flex-1 max-w-xl lg:max-w-none">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(217,119,6,0.1)",
                border: "1px solid rgba(217,119,6,0.22)",
                color: "#fbbf24",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              For skilled workers
            </div>

            <h2
              id="worker-cta-heading"
              className="font-display text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight leading-[1.1] mb-5"
              style={{ color: "#f5f0e8" }}
            >
              Turn your skills
              <br />
              <em className="hh-shimmer-text not-italic">into steady income.</em>
            </h2>

            <p className="text-base leading-relaxed max-w-[44ch] mb-8" style={{ color: "#78716c" }}>
              Join 2,400+ verified tradespeople already earning more on
              HandyHire. Build your reputation, set your own rates, and get
              matched with jobs near you.
            </p>

            {/* Perks */}
            <ul className="space-y-3 mb-9">
              {[
                "Free to join — no subscription, no hidden fees",
                "Get paid securely after every completed job",
                "Your verified badge builds trust with every client",
              ].map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm" style={{ color: "#78716c" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(217,119,6,0.12)",
                      border: "1px solid rgba(217,119,6,0.24)",
                    }}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-amber-400" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/signup?role=worker"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(180,83,9,0.45), 0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                Join as an artisan &mdash; it&apos;s free
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/workers/guide"
                className="inline-flex items-center justify-center gap-2 font-medium text-sm px-6 py-3.5 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#a8a29e",
                }}
              >
                How it works for workers
              </Link>
            </div>
          </ScrollReveal>

          {/* ── Right: earner cards ── */}
          <ScrollReveal delay={120} className="hidden lg:flex flex-col gap-3 w-72 shrink-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#57534e" }}>
                Top earners this month
              </p>
              <div className="flex flex-col gap-2.5">
                {earners.map(({ init, bg, text, name, trade, earnings }, i) => (
                  <div
                    key={name}
                    className="rounded-2xl px-4 py-3.5 flex items-center gap-3 hh-float"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      animationDelay: `${i * 0.9}s`,
                      animationDuration: `${5.5 + i * 0.8}s`,
                    }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${text}`}>{init}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#e7e5e4" }}>{name}</p>
                      <p className="text-xs" style={{ color: "#57534e" }}>{trade}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-400">{earnings}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs mt-3 text-center" style={{ color: "#44403c" }}>
                Average worker earns{" "}
                <span className="font-medium" style={{ color: "#78716c" }}>₦280k/month</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
