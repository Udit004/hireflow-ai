"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-semibold text-rose-900">Unexpected frontend error</h1>
        <p className="mt-4 text-sm text-rose-800">Please try again. If this keeps happening, refresh the page.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-rose-700 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-600"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
