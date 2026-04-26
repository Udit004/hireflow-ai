import type { SavedTestResponse } from "../types";

interface TestGenerationResultsProps {
  result: SavedTestResponse | null;
  status: string;
}

const typeStyles: Record<string, string> = {
  mcq: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  code: "bg-sky-50 text-sky-700 ring-sky-200",
  scenario: "bg-amber-50 text-amber-800 ring-amber-200",
};

const difficultyStyles: Record<string, string> = {
  easy: "bg-slate-100 text-slate-700",
  medium: "bg-[#e8efe8] text-[#2f5d62]",
  hard: "bg-rose-50 text-rose-700",
};

export function TestGenerationResults({ result, status }: TestGenerationResultsProps) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[420px] flex-col justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-6 text-slate-500 shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Output area
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Your generated test will appear here.
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Submit the form to receive a summary and a structured set of
            interview questions from the backend. The same page updates with
            the result, so you can review it immediately.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Ready
              </p>
              <p className="mt-2 text-sm text-slate-700">Awaiting submission</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Source
              </p>
              <p className="mt-2 text-sm text-slate-700">FastAPI backend</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Status
              </p>
              <p className="mt-2 text-sm text-slate-700">{status}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Generated test
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {result.role_title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {result.summary}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-72 lg:grid-cols-1">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total questions</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{result.total_questions}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{status}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {result.questions.map((question, index) => (
          <article
            key={`${question.question_type}-${index}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Question {index + 1}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {question.question_type}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${typeStyles[question.question_type] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
                >
                  {question.question_type}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[question.difficulty]}`}
                >
                  {question.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <p className="text-base leading-8 text-slate-900">{question.question}</p>

              {question.options && question.options.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={`${question.question_type}-${index}-option-${optionIndex}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="rounded-2xl border border-[#2f5d62]/15 bg-[#f2f7f7] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2f5d62]">
                  Expected answer
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-800">
                  {question.expected_answer}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
