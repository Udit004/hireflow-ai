"use client";

import { useAuth } from "@/features/auth";

import { CandidateDashboard } from "./candidate-dashboard";
import { DashboardShell } from "./dashboard-shell";
import { RecruiterDashboard } from "./recruiter-dashboard";

export function DashboardPageContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      {user.role === "recruiter" ? (
        <RecruiterDashboard user={user} />
      ) : (
        <CandidateDashboard user={user} />
      )}
    </DashboardShell>
  );
}
