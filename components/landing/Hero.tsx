import Link from "next/link";

const BRICK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cline x1='0' y1='0' x2='80' y2='0' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='0' y1='20' x2='80' y2='20' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='40' y1='0' x2='40' y2='20' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='20' y1='20' x2='20' y2='40' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='60' y1='20' x2='60' y2='40' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3C/svg%3E")`;

/* ─── Worker showcase card (desktop, aria-hidden) ─── */
function WorkerShowcase() {
  return (
    <div className="relative w-full max-w-[440px]">
      {/* Dot-grid texture behind cards */}
      <div
        className="absolute -inset-8 pointer-events-none rounded-3xl"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(28,25,23,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Card ambient glow */}
      <div
        className="absolute -inset-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 62% 38%, rgba(217,119,6,0.18) 0%, transparent 62%)",
          filter: "blur(28px)",
        }}
      />

      {/* ── Floating stat — top left ── */}
      <div
        className="hh-float absolute -top-5 -left-4 z-20 flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-2xl"
        aria-hidden="true"
        style={{
          background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="text-center">
          <p className="text-xl font-bold text-amber-400 leading-none">10k+</p>
          <p className="text-[10px] text-stone-400 mt-0.5 whitespace-nowrap">
            jobs completed
          </p>
        </div>
      </div>

      {/* ── Main worker profile card ── */}
      <div
        className="relative bg-white rounded-3xl border border-stone-100/80 p-6 z-10"
        style={{
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.05), 0 12px 28px rgba(0,0,0,0.14), 0 40px 72px rgba(0,0,0,0.22)",
        }}
      >
        {/* Worker header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div
              className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(140deg, #fef3c7 0%, #fcd34d 100%)",
              }}
            >
              <span className="text-2xl font-bold text-amber-800">CJ</span>
            </div>
            <div
              className="online-pulse absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-stone-900 text-[17px] leading-tight">
                  Chinonso James
                </p>
                <p className="text-sm text-stone-500 mt-0.5">
                  Master Electrician
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-400">
              <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current" aria-hidden="true">
                <path d="M6 0C4.07 0 2.5 1.57 2.5 3.5c0 2.73 3.5 8.5 3.5 8.5s3.5-5.77 3.5-8.5C9.5 1.57 7.93 0 6 0zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
              Lagos, Surulere
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} viewBox="0 0 12 12" className="w-4 h-4 text-amber-400 fill-current" aria-hidden="true">
                <polygon points="6,0.5 7.5,4 11.5,4.5 8.5,7.5 9.5,11.5 6,9.5 2.5,11.5 3.5,7.5 0.5,4.5 4.5,4" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-bold text-stone-800">4.9</span>
          <span className="text-sm text-stone-400">· 127 reviews</span>
        </div>

        {/* Verification badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {["NIN Verified", "Insured", "Certified"].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full"
            >
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 5l2 2 4-4" />
              </svg>
              {badge}
            </span>
          ))}
        </div>

        <div className="border-t border-stone-100 mb-4" />

        {/* Job context */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">
            Responding to
          </p>
          <p className="text-sm font-semibold text-stone-800">
            Kitchen electrical wiring &amp; safety check
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            Ikeja, Lagos &middot; Posted today
          </p>
        </div>

        {/* Quote highlight */}
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3.5 mb-5"
          style={{
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a",
          }}
        >
          <div>
            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">
              Quote sent
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">₦12,000</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-stone-400">Response time</p>
            <p className="text-sm font-bold text-stone-800 mt-0.5">8 min</p>
          </div>
        </div>

        {/* Mock action row */}
        <div className="flex gap-2">
          <div className="flex-1 text-center text-sm font-medium border border-stone-200 text-stone-700 px-4 py-2.5 rounded-xl">
            View Profile
          </div>
          <div
            className="flex-1 text-center text-sm font-semibold text-white px-4 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" }}
          >
            Accept Quote →
          </div>
        </div>
      </div>

      {/* ── More quotes row ── */}
      <div
        className="relative mt-3 z-10 bg-white border border-stone-100 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
      >
        <div className="flex -space-x-2 shrink-0">
          {[
            { init: "AF", bg: "bg-teal-100", text: "text-teal-700" },
            { init: "KB", bg: "bg-blue-100", text: "text-blue-700" },
            { init: "+2", bg: "bg-stone-100", text: "text-stone-500" },
          ].map(({ init, bg, text }) => (
            <div key={init} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}>
              <span className={`text-[10px] font-bold ${text}`}>{init}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800">3 more quotes received</p>
          <p className="text-xs text-stone-400">Last one 2 minutes ago</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
      </div>

      {/* ── Floating badge — avg response time ── */}
      <div
        className="hh-float-b absolute -bottom-4 -right-2 z-20 bg-white border border-stone-100 rounded-2xl px-3.5 py-2.5 flex items-center gap-2"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v3.5l2.5 1.5" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-stone-900 leading-none">Avg. 12 min</p>
          <p className="text-[10px] text-stone-400 mt-0.5">first response</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-10 pb-14 md:pt-14 md:pb-20"
      style={{ background: "#ffffff", backgroundImage: BRICK }}
    >
      {/* ── Warm amber glow — top right ── */}
      <div
        className="hh-blob absolute -top-24 -right-16 w-[580px] h-[480px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 55% 40%, rgba(217,119,6,0.09) 0%, transparent 65%)",
          filter: "blur(72px)",
        }}
      />
      {/* ── Secondary glow — bottom left ── */}
      <div
        className="hh-blob-b absolute bottom-[-8%] -left-16 w-[440px] h-[360px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse, rgba(217,119,6,0.06) 0%, transparent 65%)",
          filter: "blur(64px)",
          animationDelay: "-9s",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20">

          {/* ── Left: copy ── */}
          <div className="flex-1 max-w-xl lg:max-w-none">
            {/* Eyebrow */}
            <div className="hh-enter inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-3.5 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Lagos &middot; Abuja &middot; Port Harcourt &middot; 45 more cities
            </div>

            {/* Heading */}
            <h1 className="hh-enter-2 font-display text-[2.7rem] md:text-5xl lg:text-[3.6rem] leading-[1.07] text-stone-900 tracking-tight mb-5">
              Find skilled
              <br />
              tradespeople
              <br />
              <em className="text-amber-600 not-italic">you can trust.</em>
            </h1>

            <p className="hh-enter-3 text-[15px] text-stone-500 leading-relaxed max-w-[42ch] mb-7">
              Connect with verified, insured professionals near you. Post a job,
              compare quotes, and hire with confidence.
            </p>

            {/* CTAs */}
            <div className="hh-enter-4 flex flex-col sm:flex-row gap-3 mb-7">
              <Link
                href="/worker/jobs"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(180,83,9,0.3), 0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                Post a Job &mdash; it&apos;s free
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-white border border-stone-200 text-stone-800 font-medium text-sm px-6 py-3.5 rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-colors duration-150"
              >
                Browse workers
              </Link>
            </div>

            {/* Trust signals */}
            <div className="hh-enter-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {["ID & NIN Verified", "Background Checked", "4.8★ Avg Rating"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-stone-500">
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 7l4 4 6-7" />
                  </svg>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: worker showcase ── */}
          <div className="hh-enter-3 hidden lg:flex flex-1 justify-center items-center py-10" aria-hidden="true">
            <WorkerShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
