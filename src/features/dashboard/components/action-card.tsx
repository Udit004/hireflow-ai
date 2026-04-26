"use client";

import Link from "next/link";

type ActionCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: "indigo" | "sky" | "emerald" | "violet";
};

const accentMap: Record<ActionCardProps["accent"], string> = {
  indigo: "border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/80",
  sky: "border-sky-200 bg-sky-50/80 hover:bg-sky-100/80",
  emerald: "border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/80",
  violet: "border-violet-200 bg-violet-50/80 hover:bg-violet-100/80",
};

export function ActionCard({
  href,
  eyebrow,
  title,
  description,
  accent,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={`group block rounded-[1.5rem] border p-5 transition ${accentMap[accent]} shadow-[0_12px_30px_rgba(15,23,42,0.05)]`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 transition group-hover:translate-x-0.5">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex text-sm font-semibold text-slate-900">
        Open
      </span>
    </Link>
  );
}
