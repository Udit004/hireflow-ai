"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

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

function getVerdictClasses(verdict: RecruiterAttemptListItem["question_feedback"][number]["verdict"]): string {
  switch (verdict) {
    case "correct":
      return "bg-emerald-100 text-emerald-800";
    case "incorrect":
      return "bg-rose-100 text-rose-800";
    case "needs_review":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getVerdictLabel(verdict: RecruiterAttemptListItem["question_feedback"][number]["verdict"]): string {
  switch (verdict) {
    case "needs_review":
      return "Manual review";
    case "unanswered":
      return "No answer";
    default:
      return verdict;
  }
}

export default function RecruiterTestDetailsPage() {
  const params = useParams<{ id: string }>();
  const testId = typeof params?.id === "string" ? params.id : "";

  const [test, setTest] = useState<SavedTestResponse | null>(null);
  const [attempts, setAttempts] = useState<RecruiterAttemptListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { showToast } = useToast();

  const loadData = useCallback(async (withSpinner = true) => {
    if (!testId) {
      return;
    }

    if (withSpinner) {
      setLoading(true);
    }
    setError(null);
    try {
      const [savedTest, savedAttempts] = await Promise.all([
        getSavedTest(testId),
        getTestAttempts(testId),
      ]);
      setTest(savedTest);
      setAttempts(savedAttempts);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load test data.";
      setError(message);
      showToast(message, "error");
    } finally {
      if (withSpinner) {
        setLoading(false);
      }
    }
  }, [showToast, testId]);

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      if (!testId) {
        return;
      }

      try {
        const [savedTest, savedAttempts] = await Promise.all([
          getSavedTest(testId),
          getTestAttempts(testId),
        ]);
        if (!active) {
          return;
        }
        setTest(savedTest);
        setAttempts(savedAttempts);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const message = loadError instanceof Error ? loadError.message : "Unable to load test data.";
        setError(message);
        showToast(message, "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initialLoad();

    return () => {
      active = false;
    };
  }, [showToast, testId]);

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
      showToast("Test published successfully.", "success");
      await loadData(false);
    } catch (publishError) {
      const message = publishError instanceof Error ? publishError.message : "Unable to publish test.";
      setError(message);
      showToast(message, "error");
    } finally {
      setPublishing(false);
    }
  }

  async function handleCopyPublicLink() {
    if (!publicLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicLink}`);
      setCopySuccess(true);
      showToast("Public link copied to clipboard.", "success");
      window.setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      showToast("Unable to copy link from this browser. Copy manually.", "error");
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
                  <>
                    <a
                      href={publicLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-emerald-700 underline underline-offset-4"
                    >
                      Open candidate link
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyPublicLink}
                      className="rounded-full border border-emerald-300 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      {copySuccess ? "Copied" : "Copy link"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Candidate attempts</h2>
          <p className="mt-1 text-sm text-slate-600">Latest attempts are shown first with full responses and recruiter feedback.</p>

          {attempts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No attempts submitted yet.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {attempts.map((attempt, attemptIndex) => (
                <article key={attempt.attempt_id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Attempt {attempts.length - attemptIndex}</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{attempt.candidate_email}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Started: {formatDate(attempt.started_at)} | Submitted: {formatDate(attempt.submitted_at)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Auto-graded score</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">{attempt.score.toFixed(2)}%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Answered</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{attempt.feedback_summary.answered_count}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Unanswered</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{attempt.feedback_summary.unanswered_count}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">MCQ graded</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{attempt.feedback_summary.auto_graded_count}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Correct</p>
                      <p className="mt-2 text-lg font-semibold text-emerald-700">{attempt.feedback_summary.correct_count}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Incorrect</p>
                      <p className="mt-2 text-lg font-semibold text-rose-700">{attempt.feedback_summary.incorrect_count}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Manual review</p>
                      <p className="mt-2 text-lg font-semibold text-amber-700">{attempt.feedback_summary.manual_review_count}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {attempt.question_feedback.map((item) => (
                      <section key={`${attempt.attempt_id}-${item.question_index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900">Question {item.question_index + 1}</h4>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.question_type}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getVerdictClasses(item.verdict)}`}>
                            {getVerdictLabel(item.verdict)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-slate-800">{item.question}</p>

                        {item.options?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.options.map((option) => (
                              <span key={option} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                                {option}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Candidate response</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                              {item.candidate_answer || "No answer submitted."}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expected answer</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{item.expected_answer || "No expected answer saved."}</p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Feedback</p>
                          <p className="mt-2 text-sm text-slate-800">{item.feedback}</p>
                        </div>
                      </section>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
