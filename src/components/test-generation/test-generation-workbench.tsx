"use client";

import type React from "react";
import { useState } from "react";

import { generateTest } from "@/services/api";
import {
  DEFAULT_FORM_STATE,
  type TestGenerationRequest,
  type TestGenerationResponse,
} from "@/lib/test-generation";
import { TestGenerationForm } from "./test-generation-form";
import { TestGenerationResults } from "./test-generation-results";

export function TestGenerationWorkbench() {
  const [form, setForm] = useState<TestGenerationRequest>(DEFAULT_FORM_STATE);
  const [result, setResult] = useState<TestGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange<K extends keyof TestGenerationRequest>(
    field: K,
    value: TestGenerationRequest[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await generateTest(form);
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to generate the test.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const status = isSubmitting
    ? "Calling FastAPI backend..."
    : result
      ? "Ready to review"
      : "Waiting for input";

  return (
    <section className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Build request
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Enter the job description
            </h2>
          </div>
        </div>
        <TestGenerationForm
          form={form}
          isSubmitting={isSubmitting}
          error={error}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Test output
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {status}
          </span>
        </div>
        <TestGenerationResults result={result} status={status} />
      </div>
    </section>
  );
}
