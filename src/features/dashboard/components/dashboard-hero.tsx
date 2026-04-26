"use client";

import type { ReactNode } from "react";

type DashboardHeroProps = {
  badge: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function DashboardHero({
  badge,
  title,
  description,
  aside,
}: DashboardHeroProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(49,46,129,0.92),rgba(14,116,144,0.86))] px-6 py-8 text-white sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
            {badge}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
            {description}
          </p>
        </div>
        {aside ? <div className="lg:justify-self-end">{aside}</div> : null}
      </div>
    </div>
  );
}
