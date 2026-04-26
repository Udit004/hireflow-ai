"use client";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  accent: "indigo" | "sky" | "emerald" | "violet" | "amber";
};

const accentStyles: Record<StatCardProps["accent"], string> = {
  indigo: "from-indigo-500/15 to-indigo-100 text-indigo-950",
  sky: "from-sky-500/15 to-sky-100 text-sky-950",
  emerald: "from-emerald-500/15 to-emerald-100 text-emerald-950",
  violet: "from-violet-500/15 to-violet-100 text-violet-950",
  amber: "from-amber-500/15 to-amber-100 text-amber-950",
};

export function StatCard({ label, value, hint, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-[1.5rem] border border-white/70 bg-gradient-to-br ${accentStyles[accent]} p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}
