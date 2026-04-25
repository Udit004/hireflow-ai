import type React from "react";

import type {
  Difficulty,
  TestGenerationRequest,
} from "../types";

interface TestGenerationFormProps {
  form: TestGenerationRequest;
  isSubmitting: boolean;
  error: string | null;
  onChange: <K extends keyof TestGenerationRequest>(
    field: K,
    value: TestGenerationRequest[K],
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];

export function TestGenerationForm({
  form,
  isSubmitting,
  error,
  onChange,
  onSubmit,
}: TestGenerationFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Role title</span>
          <input
            value={form.role_title}
            onChange={(event) => onChange("role_title", event.target.value)}
            type="text"
            placeholder="Backend Engineer"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#2f5d62] focus:ring-4 focus:ring-[#2f5d62]/10"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Question count</span>
          <input
            value={form.question_count}
            onChange={(event) =>
              onChange("question_count", Number(event.target.value))
            }
            type="number"
            min={3}
            max={30}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#2f5d62] focus:ring-4 focus:ring-[#2f5d62]/10"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Difficulty</span>
          <select
            value={form.difficulty}
            onChange={(event) =>
              onChange("difficulty", event.target.value as Difficulty)
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#2f5d62] focus:ring-4 focus:ring-[#2f5d62]/10"
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Job description</span>
          <textarea
            value={form.job_description}
            onChange={(event) =>
              onChange("job_description", event.target.value)
            }
            placeholder="Paste the job description here..."
            minLength={10}
            rows={5}
            className="min-h-16 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#2f5d62] focus:ring-4 focus:ring-[#2f5d62]/10"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Generating..." : "Generate test"}
        </button>
      </div>
    </form>
  );
}
