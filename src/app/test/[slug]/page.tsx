"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/features/auth";

import {
  getPublicTest,
  submitPublicTest,
  type PublicTestResponse,
} from "@/features/testGeneration";

type TestPhase = "permission" | "active" | "cancelled";

function extractDurationMinutes(settings: Record<string, unknown>): number | null {
  const raw = settings.duration_minutes ?? settings.duration;
  if (typeof raw !== "number" && typeof raw !== "string") {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

function formatRemaining(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutesPart = Math.floor(safeSeconds / 60);
  const secondsPart = safeSeconds % 60;
  return `${String(minutesPart).padStart(2, "0")}:${String(secondsPart).padStart(2, "0")}`;
}

export default function PublicTestPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [test, setTest] = useState<PublicTestResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<TestPhase>("permission");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const { showToast } = useToast();
  const candidateEmail = user?.email?.trim() ?? "";

  const durationMinutes = useMemo(() => {
    if (!test) {
      return null;
    }

    return extractDurationMinutes(test.settings);
  }, [test]);

  const accountErrorMessage = useMemo(() => {
    if (authLoading || !user || user.role !== "candidate" || user.email) {
      return null;
    }

    return "Your candidate account must have an email address before starting a test.";
  }, [authLoading, user]);

  const visibleError = error ?? accountErrorMessage;

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const redirectTarget = slug ? `/test/${slug}` : "/";

    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    if (user.role !== "candidate") {
      router.replace("/unauthorized");
      return;
    }

    if (!candidateEmail) {
      showToast("Your candidate account must have an email address before starting a test.", "error");
      return;
    }

  }, [authLoading, candidateEmail, router, showToast, slug, user]);

  useEffect(() => {
    let mounted = true;

    async function loadTest() {
      if (!slug || authLoading || !user || user.role !== "candidate" || !candidateEmail) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getPublicTest(slug);
        if (mounted) {
          setTest(data);
        }
      } catch (loadError) {
        if (mounted) {
          const message = loadError instanceof Error ? loadError.message : "Unable to load test.";
          setError(message);
          showToast(message, "error");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadTest();

    return () => {
      mounted = false;
    };
  }, [authLoading, candidateEmail, showToast, slug, user]);

  const handleSubmit = useCallback(async () => {
    if (!test || phase === "cancelled") {
      return;
    }

    if (!candidateEmail) {
      const message = "Your signed-in candidate email is required before submitting.";
      setError(message);
      showToast(message, "error");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        candidate_email: candidateEmail,
        started_at: startedAt ?? undefined,
        answers: Object.entries(answers)
          .filter(([, value]) => value.trim().length > 0)
          .map(([index, value]) => ({
            question_index: Number(index),
            answer: value,
          })),
      };

      const submitted = await submitPublicTest(slug, payload);
      const paramsString = new URLSearchParams({
        attemptId: submitted.attempt_id,
        score: submitted.score.toFixed(2),
      }).toString();

      router.push(`/test/${slug}/submitted?${paramsString}`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to submit test.";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }, [answers, candidateEmail, phase, router, showToast, slug, startedAt, test]);

  useEffect(() => {
    if (phase !== "active" || !startedAt || !durationMinutes) {
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const total = durationMinutes * 60;
      const nextRemaining = Math.max(0, total - elapsed);
      setRemainingSeconds(nextRemaining);

      if (nextRemaining <= 0 && !submitting) {
        showToast("Time is up. Submitting your test.", "info");
        void handleSubmit();
      }
    };

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [durationMinutes, handleSubmit, phase, showToast, startedAt, submitting]);

  useEffect(() => {
    if (phase !== "active") {
      return;
    }

    const blockAction = (event: Event) => {
      event.preventDefault();
      showToast("Copy, paste and context actions are disabled during this test.", "info");
    };

    const blockKeyboardCopyPaste = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && (key === "c" || key == "v" || key == "x")) {
        event.preventDefault();
        showToast("Copy and paste shortcuts are disabled during this test.", "info");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setPhase("cancelled");
        showToast("Test cancelled due to tab switch.", "error");
      }
    };

    document.addEventListener("copy", blockAction);
    document.addEventListener("cut", blockAction);
    document.addEventListener("paste", blockAction);
    document.addEventListener("contextmenu", blockAction);
    document.addEventListener("keydown", blockKeyboardCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("copy", blockAction);
      document.removeEventListener("cut", blockAction);
      document.removeEventListener("paste", blockAction);
      document.removeEventListener("contextmenu", blockAction);
      document.removeEventListener("keydown", blockKeyboardCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [phase, showToast]);

  async function requestPermissions() {
    setPermissionError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "Camera/microphone permissions are not supported in this browser.";
      setPermissionError(message);
      showToast(message, "error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsPermissionGranted(true);
      showToast("Camera and microphone permissions granted.", "success");
    } catch {
      const message = "Camera and microphone permission is required to start this test.";
      setPermissionError(message);
      showToast(message, "error");
    }
  }

  function startTest() {
    if (!isPermissionGranted) {
      setPermissionError("Grant camera and microphone access before starting.");
      return;
    }

    if (!candidateEmail) {
      const message = "Your signed-in candidate email is required before starting the test.";
      setError(message);
      showToast(message, "error");
      return;
    }

    if (!startedAt) {
      setStartedAt(new Date().toISOString());
      setPhase("active");
    }
  }

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim().length > 0).length,
    [answers],
  );

  if (authLoading || (!user && !error)) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-700 shadow-sm">
          Checking candidate session...
        </div>
      </section>
    );
  }

  if (user?.role !== "candidate") {
    return null;
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? <p className="text-sm text-slate-600">Loading test...</p> : null}
          {visibleError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{visibleError}</div>
          ) : null}

        {test ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Candidate test</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{test.role_title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Difficulty: <span className="font-medium capitalize">{test.difficulty}</span> | Questions: {test.total_questions}
            </p>
            {durationMinutes ? (
              <p className="mt-1 text-sm text-slate-600">
                Duration: <span className="font-medium">{durationMinutes} minutes</span>
              </p>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-800">Your email</span>
                <input
                  type="email"
                  value={candidateEmail}
                  readOnly
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700 outline-none"
                />
                <p className="text-xs text-slate-500">This email is auto-filled from the signed-in candidate account and cannot be changed.</p>
              </label>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Progress</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{answeredCount} / {test.total_questions} answered</p>
                {phase === "active" && durationMinutes ? (
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Time left: {formatRemaining(remainingSeconds ?? durationMinutes * 60)}
                  </p>
                ) : null}
              </div>
            </div>

            {phase === "permission" ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Pre-test checks</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Allow camera and microphone access before test start.</li>
                  <li>Copy, paste and context menu are disabled during test.</li>
                  <li>Changing browser tab will cancel your test.</li>
                </ul>
                {permissionError ? (
                  <p className="text-sm text-rose-700">{permissionError}</p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={requestPermissions}
                    className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {isPermissionGranted ? "Permissions granted" : "Grant camera and mic"}
                  </button>
                  <button
                    type="button"
                    onClick={startTest}
                    className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Begin test
                  </button>
                </div>
              </div>
            ) : null}

            {phase === "active" ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit test"}
                </button>
              </div>
            ) : null}

            {phase === "cancelled" ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Test cancelled because tab change was detected. Reload this page to start again.
              </div>
            ) : null}
          </>
        ) : null}
        </div>

        {test && phase === "active" ? (
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <article key={`${question.question_type}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Question {index + 1}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                    {question.question_type}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-800">{question.question}</p>

                {question.question_type === "mcq" && question.options?.length ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <label key={`${index}-${option}`} className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              [index]: event.target.value,
                            }))
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[index] ?? ""}
                    onChange={(event) =>
                      setAnswers((current) => ({
                        ...current,
                        [index]: event.target.value,
                      }))
                    }
                    placeholder="Write your answer"
                    rows={4}
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                )}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
