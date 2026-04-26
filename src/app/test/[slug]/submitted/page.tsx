"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function SubmittedPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const searchParams = useSearchParams();

  const attemptId = searchParams.get("attemptId");
  const score = searchParams.get("score");

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Submission complete</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Thanks, your test was submitted.</h1>
        <p className="mt-4 text-sm text-slate-600">Your recruiter can now review your attempt.</p>

        <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 text-left">
          <p className="text-sm text-slate-700">Attempt ID: <span className="font-semibold text-slate-900">{attemptId ?? "Not available"}</span></p>
          <p className="text-sm text-slate-700">Score: <span className="font-semibold text-slate-900">{score ? `${score}%` : "Pending"}</span></p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/test/${slug}`}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back to test
          </Link>
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
