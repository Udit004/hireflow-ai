"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useToast } from "@/components/ToastProvider";
import type { AuthUser } from "@/features/auth";
import { getUserTests, type SavedTestListItem } from "@/features/testGeneration";

import { AccountOverviewCard } from "./account-overview-card";
import { ActionCard } from "./action-card";
import { DashboardHero } from "./dashboard-hero";
import { SectionCard } from "./section-card";
import { StatCard } from "./stat-card";

type RecruiterDashboardProps = {
  user: AuthUser;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  const { showToast } = useToast();
  const [tests, setTests] = useState<SavedTestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTests() {
      try {
        const result = await getUserTests(user.uid);
        if (!active) {
          return;
        }
        setTests(result);
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

    void loadTests();

    return () => {
      active = false;
    };
  }, [showToast, user.uid]);

  const publishedCount = useMemo(
    () => tests.filter((test) => test.status === "published").length,
    [tests],
  );
  const responseCount = useMemo(
    () => tests.reduce((sum, test) => sum + test.attempt_count, 0),
    [tests],
  );
  const latestTest = tests[0];

  return (
    <>
      <DashboardHero
        badge="Recruiter Workspace"
        title={`Welcome back, ${user.displayName || "recruiter"}.`}
        description="Create new assessments, monitor published tests, and review candidate responses from one focused dashboard."
        aside={<AccountOverviewCard user={user} />}
      />

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Created Tests"
          value={loading ? "..." : String(tests.length)}
          hint="All assessments you have generated."
          accent="indigo"
        />
        <StatCard
          label="Published"
          value={loading ? "..." : String(publishedCount)}
          hint="Tests currently open for candidates."
          accent="sky"
        />
        <StatCard
          label="Responses"
          value={loading ? "..." : String(responseCount)}
          hint="Total candidate submissions received."
          accent="emerald"
        />
        <StatCard
          label="Latest Test"
          value={loading ? "..." : latestTest ? latestTest.role_title : "None yet"}
          hint="Most recently created assessment."
          accent="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          eyebrow="Quick Actions"
          title="Recruiter shortcuts"
          description="Jump directly into the core workflows without navigating through multiple pages."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ActionCard
              href="/create-test"
              eyebrow="Build"
              title="Create a New Test"
              description="Generate a fresh assessment from a job description and publish it when ready."
              accent="indigo"
            />
            <ActionCard
              href="/dashboard/tests"
              eyebrow="Manage"
              title="Open My Created Tests"
              description="See every created test and open the responses received for each assessment."
              accent="emerald"
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Recent Tests"
          title="Latest assessments"
          description="Your most recently created tests are listed here with response status."
        >
          {loading ? (
            <p className="text-sm text-slate-600">Loading recent tests...</p>
          ) : tests.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No created tests yet. Start by generating your first assessment.
            </div>
          ) : (
            <div className="space-y-3">
              {tests.slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        {test.role_title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Created {formatDate(test.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-slate-700 shadow-sm">
                        {test.status}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {test.attempt_count} responses
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/tests/${test.id}`}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      View responses
                    </Link>
                  </div>
                </div>
              ))}
              <Link
                href="/dashboard/tests"
                className="inline-flex pt-2 text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                View all created tests
              </Link>
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
