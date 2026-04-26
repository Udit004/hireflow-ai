"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getPublicTest,
  submitPublicTest,
  type PublicTestResponse,
} from "@/features/testGeneration";

export default function PublicTestPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const router = useRouter();

  const [test, setTest] = useState<PublicTestResponse | null>(null);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTest() {
      if (!slug) {
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
          setError(loadError instanceof Error ? loadError.message : "Unable to load test.");
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
  }, [slug]);

  function startTest() {
    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }
  }

  async function handleSubmit() {
    if (!test) {
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        candidate_email: email.trim(),
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
      setError(submitError instanceof Error ? submitError.message : "Unable to submit test.");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim().length > 0).length,
    [answers],
  );

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? <p className="text-sm text-slate-600">Loading test...</p> : null}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        {test ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Candidate test</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{test.role_title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Difficulty: <span className="font-medium capitalize">{test.difficulty}</span> | Questions: {test.total_questions}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-800">Your email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="candidate@email.com"
                  className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </label>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Progress</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{answeredCount} / {test.total_questions} answered</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startTest}
                disabled={Boolean(startedAt)}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
              >
                {startedAt ? "Test started" : "Start test"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit test"}
              </button>
            </div>
          </>
        ) : null}
      </div>

      {test ? (
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
    </section>
  );
}
