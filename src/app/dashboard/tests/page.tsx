"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useToast } from "@/components/ToastProvider";
import { ProtectedRoute, useAuth } from "@/features/auth";
import { getUserTests, type SavedTestListItem } from "@/features/testGeneration";

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export default function RecruiterTestsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tests, setTests] = useState<SavedTestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTests() {
      if (!user?.uid) {
        return;
      }

      try {
        const createdTests = await getUserTests(user.uid);
        if (!active) {
          return;
        }
        setTests(createdTests);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load created tests.";
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
  }, [showToast, user?.uid]);

  return (
    <ProtectedRoute requiredRole="recruiter">
      <section className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_42%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  Recruiter dashboard
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  My created tests
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Review every test you created and open the responses received for each one.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/create-test"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Create New Test
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Back to Dashboard
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
              Loading your created tests...
            </div>
          ) : null}

          {!loading && tests.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                No tests yet
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Your created tests will appear here.
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Generate your first assessment and publish it to start collecting candidate responses.
              </p>
              <Link
                href="/create-test"
                className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Create Test
              </Link>
            </div>
          ) : null}

          {!loading && tests.length > 0 ? (
            <div className="grid gap-5">
              {tests.map((test) => {
                const candidateHref = test.status === "published" && test.public_slug
                  ? `/test/${test.public_slug}`
                  : null;

                return (
                  <article
                    key={test.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {test.status === "published" ? "Live test" : "Draft test"}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                          {test.role_title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Created on {formatDate(test.created_at)}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-white px-5 py-4 text-right shadow-sm">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Responses received
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-slate-950">
                          {test.attempt_count}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 px-6 py-6 md:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Difficulty</p>
                        <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                          {test.difficulty}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Questions</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {test.total_questions}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                        <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                          {test.status}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Test ID</p>
                        <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                          {test.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 px-6 pb-6">
                      <Link
                        href={`/dashboard/tests/${test.id}`}
                        className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      >
                        View Responses
                      </Link>
                      {candidateHref ? (
                        <Link
                          href={candidateHref}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Open Candidate Test
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/tests/${test.id}`}
                          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Publish From Details
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
