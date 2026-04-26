"use client";

import type { ReactNode } from "react";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-5">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
