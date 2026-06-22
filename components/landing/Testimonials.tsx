import ScrollReveal from "@/components/ui/ScrollReveal";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const testimonials = [
  {
    quote:
      "I needed a licensed electrician after a power fault at home. HandyHire connected me within 20 minutes. The work was inspected, professional, and exactly what I paid for.",
    name: "Tolani Adeyemi",
    location: "Lagos, Surulere",
    role: "Client",
    initials: "TA",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
    featured: false,
  },
  {
    quote:
      "Before HandyHire, I spent hours searching for clients. Now jobs come directly to me based on my skills and location. My income has more than doubled in six months.",
    name: "Emmanuel Okafor",
    location: "Abuja, Wuse II",
    role: "Worker — Plumber",
    initials: "EO",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
    featured: true,
  },
  {
    quote:
      "The verification system makes all the difference. I can see real credentials and reviews before committing. It's the trust I needed to finally hire with peace of mind.",
    name: "Yewande Bello",
    location: "Port Harcourt, GRA",
    role: "Client",
    initials: "YB",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-700",
    featured: false,
  },
];

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "#F0EAD8" }}
      aria-labelledby="testimonials-heading"
    >
      {/* Subtle radial warm wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,119,6,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: GRAIN, opacity: 0.04 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12 md:mb-14">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
            Real stories
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl md:text-5xl text-stone-900 tracking-tight"
          >
            Trusted by thousands
          </h2>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
          {testimonials.map(
            ({ quote, name, location, role, initials, avatarBg, avatarText, featured }, i) => (
              <ScrollReveal key={name} delay={i * 75}>
                <blockquote
                  className="relative flex flex-col justify-between gap-6 rounded-2xl p-7 border hover:-translate-y-1 transition-transform duration-200"
                  style={
                    featured
                      ? {
                          background: "linear-gradient(150deg, #1c1917 0%, #110e09 100%)",
                          border: "1px solid rgba(217,119,6,0.15)",
                          boxShadow:
                            "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                          marginTop: "-12px",
                          marginBottom: "-12px",
                        }
                      : {
                          background: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(0,0,0,0.07)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
                          backdropFilter: "blur(8px)",
                        }
                  }
                >
                  {/* Featured: amber edge glow */}
                  {featured && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      aria-hidden="true"
                      style={{
                        backgroundImage:
                          "radial-gradient(ellipse at 50% 0%, rgba(217,119,6,0.12) 0%, transparent 60%)",
                      }}
                    />
                  )}

                  {/* Quote mark */}
                  <span
                    className={`relative font-display text-6xl leading-none select-none mb-2 block ${
                      featured ? "text-amber-500/30" : "text-stone-200"
                    }`}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="relative">
                    <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                      {[0, 1, 2, 3, 4].map((j) => (
                        <svg key={j} viewBox="0 0 12 12" className="w-3.5 h-3.5 text-amber-400 fill-current" aria-hidden="true">
                          <path d="M6 1l1.34 2.72 3 .44-2.17 2.11.51 2.98L6 7.94 3.32 9.25l.51-2.98L1.66 4.16l3-.44L6 1z" />
                        </svg>
                      ))}
                    </div>
                    <p className={`text-sm leading-relaxed ${featured ? "text-stone-300" : "text-stone-700"}`}>
                      {quote}
                    </p>
                  </div>

                  {/* Author */}
                  <footer
                    className={`relative flex items-center gap-3 pt-5 border-t ${
                      featured ? "border-white/[0.07]" : "border-stone-200/70"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${avatarText}`}>{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <cite className={`not-italic text-sm font-semibold ${featured ? "text-stone-100" : "text-stone-900"}`}>
                        {name}
                      </cite>
                      <p className={`text-xs mt-0.5 ${featured ? "text-stone-500" : "text-stone-400"}`}>
                        {location}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        featured
                          ? "text-stone-400 bg-stone-800 border-stone-700"
                          : "text-stone-500 bg-stone-100 border-stone-200"
                      }`}
                    >
                      {role}
                    </span>
                  </footer>
                </blockquote>
              </ScrollReveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
