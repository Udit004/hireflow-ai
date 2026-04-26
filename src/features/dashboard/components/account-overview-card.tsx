"use client";

import type { AuthUser } from "@/features/auth";

type AccountOverviewCardProps = {
  user: AuthUser;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0]?.[0] ?? "U"}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function AccountOverviewCard({ user }: AccountOverviewCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-base font-semibold">
          {getInitials(user.displayName, user.email)}
        </div>
        <div>
          <p className="text-lg font-semibold">{user.displayName || "HireFlow user"}</p>
          <p className="text-sm text-white/75">{user.email || "No email available"}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Role
          </p>
          <p className="mt-2 text-sm font-semibold capitalize">{user.role}</p>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Member Since
          </p>
          <p className="mt-2 text-sm font-semibold">
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
