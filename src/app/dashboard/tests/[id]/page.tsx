"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ProtectedRoute } from "@/features/auth";
import {
  getSavedTest,
  getTestAttempts,
  publishTest,
  type RecruiterAttemptListItem,
  type SavedTestResponse,
} from "@/features/testGeneration";

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function RecruiterTestDetailsPage() {
  const params = useParams<{ id: string }>();
  const testId = typeof params?.id === "string" ? params.id : "";

  const [test, setTest] = useState<SavedTestResponse | null>(null);
  const [attempts, setAttempts] = useState<RecruiterAttemptListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!testId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [savedTest, savedAttempts] = await Promise.all([
        getSavedTest(testId),
        getTestAttempts(testId),
      ]);
      setTest(savedTest);
      setAttempts(savedAttempts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load test data.");
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const publicLink = useMemo(() => {
    if (!test?.public_slug) {
      return null;
    }

    return `/test/${test.public_slug}`;
  }, [test?.public_slug]);

  async function handlePublish() {
    if (!test || test.status === "published") {
      return;
    }

    setPublishing(true);
    setError(null);
    try {
      await publishTest(test.id);
      await loadData();
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to publish test.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <ProtectedRoute requiredRole="recruiter">
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recruiter view</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Test details</h1>
            </div>
            <Link
              href="/create-test"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to create test
            </Link>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading test details...</p>
          ) : null}

          {test ? (
            <div className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{test.role_title}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                  <p className="mt-2 text-sm font-semibold capitalize text-slate-900">{test.status}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Questions</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{test.total_questions}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Published at</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(test.published_at)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing || test.status === "published"}
                  className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {test.status === "published" ? "Published" : publishing ? "Publishing..." : "Publish test"}
                </button>
                {publicLink ? (
                  <a
                    href={publicLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-700 underline underline-offset-4"
                  >
                    Open candidate link
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Candidate attempts</h2>
          <p className="mt-1 text-sm text-slate-600">Latest attempts are shown first.</p>

          {attempts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No attempts submitted yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Candidate</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Score</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Started</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((attempt) => (
                    <tr key={attempt.attempt_id}>
                      <td className="px-3 py-3 text-sm text-slate-800">{attempt.candidate_email}</td>
                      <td className="px-3 py-3 text-sm font-semibold text-slate-900">{attempt.score.toFixed(2)}%</td>
                      <td className="px-3 py-3 text-sm text-slate-700">{formatDate(attempt.started_at)}</td>
                      <td className="px-3 py-3 text-sm text-slate-700">{formatDate(attempt.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
