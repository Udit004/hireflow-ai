"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useToast } from "@/components/ToastProvider";
import type { AuthUser } from "@/features/auth";
import {
  getCandidateAttemptHistory,
  type CandidateAttemptHistoryItem,
} from "@/features/testGeneration";

import { AccountOverviewCard } from "./account-overview-card";
import { ActionCard } from "./action-card";
import { DashboardHero } from "./dashboard-hero";
import { SectionCard } from "./section-card";
import { StatCard } from "./stat-card";

type CandidateDashboardProps = {
  user: AuthUser;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export function CandidateDashboard({ user }: CandidateDashboardProps) {
  const { showToast } = useToast();
  const [attempts, setAttempts] = useState<CandidateAttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAttempts() {
      try {
        const result = await getCandidateAttemptHistory(user.uid);
        if (!active) {
          return;
        }
        setAttempts(result);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your dashboard.";
        setError(message);
        showToast(message, "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAttempts();

    return () => {
      active = false;
    };
  }, [showToast, user.uid]);

  const averageScore = useMemo(() => {
    if (attempts.length === 0) {
      return "0.00%";
    }

    const total = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return `${(total / attempts.length).toFixed(2)}%`;
  }, [attempts]);

  const latestAttempt = attempts[0];

  return (
    <>
      <DashboardHero
        badge="Candidate Workspace"
        title={`Welcome back, ${user.displayName || "candidate"}.`}
        description="Track your submitted assessments, keep an eye on recent scores, and quickly jump back to your personal test history."
        aside={<AccountOverviewCard user={user} />}
      />

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Tests Submitted"
          value={loading ? "..." : String(attempts.length)}
          hint="Total assessments completed with this account."
          accent="violet"
        />
        <StatCard
          label="Average Score"
          value={loading ? "..." : averageScore}
          hint="Average score across your submitted tests."
          accent="emerald"
        />
        <StatCard
          label="Latest Activity"
          value={loading ? "..." : latestAttempt ? formatDate(latestAttempt.submitted_at).split(",")[0] : "No attempts"}
          hint="Most recent submission date."
          accent="sky"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Quick Actions"
          title="What would you like to do?"
          description="The most common actions for candidates are grouped here for faster access."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ActionCard
              href="/dashboard/attempts"
              eyebrow="History"
              title="Open My Test History"
              description="Review all submitted tests, scores, and timestamps linked to your email."
              accent="violet"
            />
            <ActionCard
              href="/"
              eyebrow="Home"
              title="Return to Home"
              description="Go back to the main landing page before opening another shared test link."
              accent="sky"
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Recent Activity"
          title="Latest submissions"
          description="Your most recent attempts appear here first."
        >
          {loading ? (
            <p className="text-sm text-slate-600">Loading recent submissions...</p>
          ) : attempts.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No test submissions yet. Once you complete a test, it will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 3).map((attempt) => (
                <div
                  key={attempt.attempt_id}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        {attempt.role_title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Submitted {formatDate(attempt.submitted_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                      {attempt.score.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
              <Link
                href="/dashboard/attempts"
                className="inline-flex pt-2 text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                View all submissions
              </Link>
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
