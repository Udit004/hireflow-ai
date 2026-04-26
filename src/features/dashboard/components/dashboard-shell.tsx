"use client";

import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(224,231,255,0.85),_rgba(248,250,252,1)_45%,_rgba(255,255,255,1)_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
    </section>
  );
}
