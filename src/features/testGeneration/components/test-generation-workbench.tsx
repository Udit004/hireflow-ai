"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { generateTest, publishTest } from "../services/testGenerationService";
import {
  DEFAULT_FORM_STATE,
  type PublishTestResponse,
  type SavedTestResponse,
  type TestGenerationRequest,
} from "../types";
import { TestGenerationForm } from "./test-generation-form";
import { TestGenerationResults } from "./test-generation-results";

export function TestGenerationWorkbench() {
  const router = useRouter();
  const [form, setForm] = useState<TestGenerationRequest>(DEFAULT_FORM_STATE);
  const [result, setResult] = useState<SavedTestResponse | null>(null);
  const [publishResult, setPublishResult] = useState<PublishTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

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
      setPublishResult(null);
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

  async function handlePublish() {
    if (!result?.id) {
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const response = await publishTest(result.id);
      setPublishResult(response);
      router.push(`/dashboard/tests/${result.id}`);
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Unable to publish this test.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  const status = isSubmitting
    ? "Calling FastAPI backend..."
    : isPublishing
      ? "Publishing test..."
      : result
      ? "Ready to review"
      : "Waiting for input";

  return (
    <section className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8 sm:m-5 m-2">
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

      <div className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8 sm:m-5 m-2">
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
        {result ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || result.status === "published"}
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {result.status === "published"
                ? "Already published"
                : isPublishing
                  ? "Publishing..."
                  : "Publish test"}
            </button>
            {publishResult ? (
              <a
                href={publishResult.public_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-emerald-800 underline underline-offset-4"
              >
                Open public link
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
