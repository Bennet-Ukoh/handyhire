import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — HandyHire Admin" };

function ComingSoonCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.04)" }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,0,0,0.04)", color: "#78716c" }}
            >
              Coming soon
            </span>
          </div>
          <p className="text-sm text-stone-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Platform configuration and admin preferences.</p>
      </div>

      <section className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Platform</p>
        <ComingSoonCard
          title="Platform Configuration"
          description="Control feature flags, service categories, fee structure, and platform-wide rules."
          icon={
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10" cy="10" r="3" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
            </svg>
          }
        />
        <ComingSoonCard
          title="Verification Rules"
          description="Configure NIN verification requirements, background check providers, and document policies."
          icon={
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 1.5L3 5v5c0 4.3 3 7.5 7 8.5 4-1 7-4.2 7-8.5V5L10 1.5z" />
              <path d="M7 10l2 2 4-4" />
            </svg>
          }
        />
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Notifications</p>
        <ComingSoonCard
          title="Notification Preferences"
          description="Control which admin events trigger email alerts and how often digest reports are sent."
          icon={
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8a6 6 0 0 1 12 0c0 3.5 1.5 4.5 2 5.5H2c.5-1 2-2 2-5.5z" />
              <path d="M8.5 17a1.5 1.5 0 0 0 3 0" />
            </svg>
          }
        />
        <ComingSoonCard
          title="Admin Access"
          description="Manage admin team members, role assignments, and audit log access controls."
          icon={
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="7" r="4" />
              <path d="M2 17a6 6 0 0 1 12 0" />
              <path d="M15 9l2 2 3-3" />
            </svg>
          }
        />
      </section>
    </div>
  );
}
