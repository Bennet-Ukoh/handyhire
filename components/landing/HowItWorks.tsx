"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BRICK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cline x1='0' y1='0' x2='80' y2='0' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='0' y1='20' x2='80' y2='20' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='40' y1='0' x2='40' y2='20' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='20' y1='20' x2='20' y2='40' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3Cline x1='60' y1='20' x2='60' y2='40' stroke='%23d0cbc3' stroke-width='1.5'/%3E%3C/svg%3E")`;

type Audience = "clients" | "workers";

const steps: Record<
  Audience,
  { title: string; description: string; eyebrow: string }[]
> = {
  clients: [
    {
      eyebrow: "Step 1",
      title: "Post your job",
      description:
        "Describe what you need, your location, and preferred timeline. Takes under two minutes — no sign-up required to start.",
    },
    {
      eyebrow: "Step 2",
      title: "Compare quotes",
      description:
        "Receive quotes from verified workers nearby. View credentials, past reviews, and pricing side-by-side before deciding.",
    },
    {
      eyebrow: "Step 3",
      title: "Hire with confidence",
      description:
        "Choose your worker, pay securely through the platform. Payment is released only when you confirm the job is done.",
    },
  ],
  workers: [
    {
      eyebrow: "Step 1",
      title: "Build your profile",
      description:
        "Add your trade skills, service area, and certifications. Complete NIN and background verification in minutes.",
    },
    {
      eyebrow: "Step 2",
      title: "Discover nearby jobs",
      description:
        "Browse posted jobs matching your skills and location, or get notified instantly when a perfect match comes in.",
    },
    {
      eyebrow: "Step 3",
      title: "Quote, win, and earn",
      description:
        "Submit competitive quotes, complete jobs, earn ratings, and build a reputation that brings clients directly to you.",
    },
  ],
};

export default function HowItWorks() {
  const [audience, setAudience] = useState<Audience>("clients");
  const activeSteps = steps[audience];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "#ffffff", backgroundImage: BRICK }}
      aria-labelledby="how-heading"
    >
      {/* Top amber wash from hero */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(217,119,6,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-10 md:mb-12">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2
            id="how-heading"
            className="font-display text-4xl md:text-5xl text-stone-900 tracking-tight mb-4"
          >
            Simple from start to finish
          </h2>
          <p className="text-base text-stone-500 max-w-[40ch] mx-auto">
            Whether you need help or offer it, HandyHire is built for clarity
            at every step.
          </p>
        </ScrollReveal>

        {/* Tab toggle */}
        <ScrollReveal delay={80} className="flex justify-center mb-12 md:mb-14">
          <div
            className="flex border-b border-stone-200"
            role="tablist"
            aria-label="Audience selector"
          >
            {(["clients", "workers"] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={audience === tab}
                aria-controls="steps-panel"
                onClick={() => setAudience(tab)}
                className={`relative px-7 py-3 text-sm font-semibold transition-colors duration-200 ${
                  audience === tab
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab === "clients" ? "For Clients" : "For Workers"}
                {audience === tab && (
                  <span
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #d97706, #b45309)" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div
          id="steps-panel"
          role="tabpanel"
          aria-labelledby={`tab-${audience}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
        >
          {activeSteps.map((step, i) => (
            <div key={i} className="relative flex gap-5 md:flex-col md:gap-0">
                {/* Desktop connector */}
                {i < 2 && (
                  <div
                    className="hidden md:flex absolute top-7 left-[calc(50%+2rem)] items-center"
                    style={{ width: "calc(100% - 4rem)" }}
                    aria-hidden="true"
                  >
                    <div className="flex-1 h-px bg-stone-200" />
                    <svg viewBox="0 0 8 8" className="w-2 h-2 text-stone-300 fill-current shrink-0 -ml-px">
                      <polygon points="0,0 8,4 0,8" />
                    </svg>
                  </div>
                )}

                {/* Step number */}
                <div className="flex items-start md:mb-5 shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 shrink-0"
                    style={{
                      background: "linear-gradient(145deg, #1c1917 0%, #292524 100%)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="font-display text-2xl text-amber-400">{i + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 md:flex-none">
                  <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
                    {step.eyebrow}
                  </p>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
                </div>

                {/* Mobile connector */}
                {i < 2 && (
                  <div
                    className="md:hidden absolute left-7 top-16 bottom-0 flex flex-col items-center gap-1"
                    aria-hidden="true"
                  >
                    <div className="w-px flex-1 bg-stone-200" />
                    <svg viewBox="0 0 8 8" className="w-2 h-2 text-stone-300 fill-current rotate-90">
                      <polygon points="0,0 8,4 0,8" />
                    </svg>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
