"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useToast } from "@/components/ToastProvider";
import { ProtectedRoute, useAuth } from "@/features/auth";
import {
  getCandidateAttemptHistory,
  type CandidateAttemptHistoryItem,
} from "@/features/testGeneration";

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function CandidateAttemptsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [attempts, setAttempts] = useState<CandidateAttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAttempts() {
      if (!user?.uid) {
        return;
      }

      try {
        const history = await getCandidateAttemptHistory(user.uid);
        if (!active) {
          return;
        }
        setAttempts(history);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your attempt history.";
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
  }, [showToast, user?.uid]);

  return (
    <ProtectedRoute requiredRole="candidate">
      <section className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_45%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Candidate dashboard
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  My submitted tests
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Review every test attempt submitted using{" "}
                  <span className="font-semibold text-slate-900">{user?.email ?? "-"}</span>.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href="/"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
              Loading your test history...
            </div>
          ) : null}

          {!loading && attempts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                No attempts yet
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Your submitted tests will appear here.
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Once you complete a shared candidate test, it will be listed in this history.
              </p>
            </div>
          ) : null}

          {!loading && attempts.length > 0 ? (
            <div className="grid gap-5">
              {attempts.map((attempt, index) => (
                <article
                  key={attempt.attempt_id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Attempt {attempts.length - index}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                        {attempt.role_title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Submitted on {formatDate(attempt.submitted_at)}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white px-5 py-4 text-right shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Score
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-slate-950">
                        {attempt.score.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 px-6 py-6 md:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Difficulty</p>
                      <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                        {attempt.difficulty}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Questions</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {attempt.total_questions}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Started</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatDate(attempt.started_at)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attempt ID</p>
                      <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                        {attempt.attempt_id}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
